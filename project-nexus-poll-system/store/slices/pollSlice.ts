import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, getDoc, doc, updateDoc, increment, onSnapshot, writeBatch, arrayRemove, arrayUnion, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { RootState } from '../store';

interface Poll {
    id: string;
    question: string;
    creatorId: string; // Add creator tracking
    options: {
        [optionId: string]: {
            text: string;
            votes: number;
            voters: string[]; // Track user votes
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

// Async Thunk: Fetch polls from Firestore
export const fetchPolls = createAsyncThunk('polls/fetchPolls', async (_, { dispatch }) => {
    const querySnapshot = await getDocs(collection(db, 'polls'));
    const polls = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Poll[];

    // Set up real-time listener
    onSnapshot(collection(db, 'polls'), (snapshot) => {
        const updatedPolls = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Poll[];
        dispatch(setPolls(updatedPolls));
    });

    return polls;
});

// Async Thunk: Handle voting
export const voteOnPoll = createAsyncThunk('polls/vote',
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

        if (previousVote) {
            batch.update(pollRef, {
                [`options.${previousVote[0]}.votes`]: increment(-1),
                [`options.${previousVote[0]}.voters`]: arrayRemove(userId),
                totalVotes: increment(-1)
            });
        }

        batch.update(pollRef, {
            [`options.${optionId}.votes`]: increment(1),
            [`options.${optionId}.voters`]: arrayUnion(userId),
            totalVotes: increment(previousVote ? 0 : 1)
        });

        await batch.commit();
        return { pollId, optionId, userId };
    });

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
                const { pollId, optionId } = action.payload;
                const poll = state.polls.find(p => p.id === pollId);
                if (poll) {
                    const option = poll.options[optionId];
                    if (option) {
                        option.votes += 1;
                        poll.totalVotes += 1;
                    }
                }
            });
    }
});

export const createPoll = createAsyncThunk('polls/create',
    async ({ question, options, userId }: { question: string; options: string[]; userId: string }) => {
        const pollRef = doc(collection(db, 'polls'));

        const pollData = {
            question,
            creatorId: userId,
            totalVotes: 0,
            options: options.reduce((acc, text, index) => {
                acc[index] = { text, votes: 0, voters: [] };
                return acc;
            }, {} as Record<string, { text: string; votes: number; voters: string[] }>)
        };

        await setDoc(pollRef, pollData);
        return { id: pollRef.id, ...pollData };
    });

export const deletePoll = createAsyncThunk('polls/delete',
    async ({ pollId, userId }: { pollId: string; userId: string }) => {
        const pollRef = doc(db, 'polls', pollId);
        const pollDoc = await getDoc(pollRef);

        if (pollDoc.data()?.creatorId !== userId) {
            throw new Error('Unauthorized to delete this poll');
        }

        await deleteDoc(pollRef);
        return pollId;
    });

export const { setPolls } = pollSlice.actions;

export default pollSlice.reducer;