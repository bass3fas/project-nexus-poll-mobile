import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { auth, db } from '../../firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';

interface AuthState {
    user: null | { uid: string; email: string | null; name?: string };
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    status: 'idle',
    error: null
};

export const signIn = createAsyncThunk('auth/signIn', async ({ email, password }: { email: string; password: string }) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { uid: userCredential.user.uid, email: userCredential.user.email };
});

export const signUp = createAsyncThunk('auth/signUp', async ({ email, password, name }: { email: string; password: string; name: string }, { dispatch }) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Add user document
    await setDoc(doc(db, 'users', userCredential.user.uid), {
        name,
        email,
        createdAt: serverTimestamp()
    });
    return { uid: userCredential.user.uid, email, name };
});

export const signOutUser = createAsyncThunk('auth/signOut', async () => {
    await signOut(auth);
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(signIn.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(signIn.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(signIn.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Authentication failed';
            })
            .addCase(signUp.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(signUp.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(signUp.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Registration failed';
            })
            .addCase(signOutUser.fulfilled, (state) => {
                state.user = null;
                state.status = 'idle';
            });
    }
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
