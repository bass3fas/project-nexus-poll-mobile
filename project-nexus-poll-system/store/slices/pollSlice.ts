import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

interface Poll {
    id: string;
    question: string;
    options: Array<{ id: string; text: string; votes: number }>;
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
export const fetchPolls = createAsyncThunk('polls/fetchPolls', async () => {
    const querySnapshot = await getDocs(collection(db, 'polls'));
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Poll[];
});

// Async Thunk: Handle voting
export const voteOnPoll = createAsyncThunk('polls/vote',
    async ({ pollId, optionId }: { pollId: string; optionId: string }) => {
        const pollRef = doc(db, 'polls', pollId);
        await updateDoc(pollRef, {
            [`options.${optionId}.votes`]: increment(1)
        });
        return { pollId, optionId };
    });

const pollSlice = createSlice({
    name: 'polls',
    initialState,
    reducers: {},
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
                    const option = poll.options.find(opt => opt.id === optionId);
                    if (option) option.votes += 1;
                }
            });
    }
});

export default pollSlice.reducer;