import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    collection,
    getDocs,
    getDoc,
    doc,
    writeBatch,
    onSnapshot,
    arrayRemove,
    arrayUnion,
    increment,
    setDoc,
    deleteDoc
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { RootState } from '../store';

interface Poll {
    id: string;
    question: string;
    creatorId: string;
    creatorName: string; // Add creatorName to Poll interface
    options: {
        [optionId: string]: {
            text: string;
            votes: number;
            voters: string[];
        };
    };
    totalVotes: number;
}

interface PollState {
    polls: Poll[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: PollState = {
    polls: [],
    status: 'idle',
    error: null
};

/**
 * Helper function to ensure each option's voters array is never undefined.
 */
function normalizePollData(docData: any, docId: string): Poll {
    const { options = {}, ...rest } = docData;
    const normalizedOptions = Object.entries(options).reduce((acc, [key, optionValue]) => {
        const { text = '', votes = 0, voters = [] } = optionValue as { text?: string; votes?: number; voters?: string[] } || {};
        acc[key] = { text, votes, voters };
        return acc;
    }, {} as Poll['options']);

    return {
        id: docId,
        ...rest,
        options: normalizedOptions,
        totalVotes: Object.values(normalizedOptions).reduce((sum, option) => sum + option.votes, 0)
    } as Poll;
}

// Async Thunk: Fetch polls from Firestore
export const fetchPolls = createAsyncThunk('polls/fetchPolls', async (_, { dispatch }) => {
    const querySnapshot = await getDocs(collection(db, 'polls'));
    const polls = querySnapshot.docs.map(doc =>
        normalizePollData(doc.data(), doc.id)
    );

    // Set up real-time listener
    onSnapshot(collection(db, 'polls'), (snapshot) => {
        const updatedPolls = snapshot.docs.map(docSnap =>
            normalizePollData(docSnap.data(), docSnap.id)
        );
        dispatch(setPolls(updatedPolls));
    });

    return polls;
});

// Async Thunk: Handle voting
export const voteOnPoll = createAsyncThunk(
    'polls/vote',
    async ({ pollId, optionId, userId }: { pollId: string; optionId: string; userId: string }, { getState }) => {
        const state = getState() as RootState;
        const poll = state.poll.polls.find(p => p.id === pollId);
        if (!poll) throw new Error('Poll not found');

        // Find existing vote
        const previousVote = Object.entries(poll.options).find(([_, option]) =>
            option.voters.includes(userId)
        );

        const pollRef = doc(db, 'polls', pollId);
        const batch = writeBatch(db);

        // Remove previous votes if found
        if (previousVote) {
            batch.update(pollRef, {
                [`options.${previousVote[0]}.votes`]: increment(-1),
                [`options.${previousVote[0]}.voters`]: arrayRemove(userId)
            });
        }

        // Add new vote
        batch.update(pollRef, {
            [`options.${optionId}.votes`]: increment(1),
            [`options.${optionId}.voters`]: arrayUnion(userId)
        });

        await batch.commit();
        return { pollId, optionId, userId };
    }
);

export const createPoll = createAsyncThunk(
    'polls/create',
    async ({ question, options, userId }: { question: string; options: string[]; userId: string }) => {
        const userDoc = await getDoc(doc(db, 'users', userId));
        const userName = userDoc.data()?.name || 'Unknown';

        const pollRef = doc(collection(db, 'polls'));
        const pollData = {
            question,
            creatorId: userId,
            creatorName: userName, // Add creatorName to poll data
            totalVotes: 0,
            options: options.reduce((acc, text, index) => {
                acc[index] = { text, votes: 0, voters: [] };
                return acc;
            }, {} as Record<string, { text: string; votes: number; voters: string[] }>)
        };

        await setDoc(pollRef, pollData);
        return { id: pollRef.id, ...pollData };
    }
);

export const deletePoll = createAsyncThunk(
    'polls/delete',
    async ({ pollId, userId }: { pollId: string; userId: string }) => {
        const pollRef = doc(db, 'polls', pollId);
        const pollDoc = await getDoc(pollRef);
        if (pollDoc.data()?.creatorId !== userId) {
            throw new Error('Unauthorized to delete this poll');
        }
        await deleteDoc(pollRef);
        return pollId;
    }
);

const pollSlice = createSlice({
    name: 'polls',
    initialState,
    reducers: {
        setPolls: (state, action) => {
            state.polls = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPolls.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPolls.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.polls = action.payload;
            })
            .addCase(fetchPolls.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch polls';
            })
            .addCase(voteOnPoll.fulfilled, (state, action) => {
                const { pollId, optionId, userId } = action.payload;
                const poll = state.polls.find(p => p.id === pollId);
                if (!poll) return;

                // Remove previous votes
                Object.values(poll.options).forEach(option => {
                    if (option.voters.includes(userId)) {
                        option.votes--;
                        option.voters = option.voters.filter(uid => uid !== userId);
                    }
                });

                // Add new vote
                poll.options[optionId].votes++;
                poll.options[optionId].voters.push(userId);

                // Recalculate total votes
                poll.totalVotes = Object.values(poll.options).reduce((sum, opt) => sum + opt.votes, 0);
            })
            // Comment out the line below to avoid adding a poll twice
            // .addCase(createPoll.fulfilled, (state, action) => {
            //     state.polls.push(action.payload);
            // })
            .addCase(deletePoll.fulfilled, (state, action) => {
                state.polls = state.polls.filter(poll => poll.id !== action.payload);
            });
    }
});

export const { setPolls } = pollSlice.actions;
export default pollSlice.reducer;