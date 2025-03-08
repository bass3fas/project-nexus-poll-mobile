import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { auth } from '../../firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

interface AuthState {
    user: null | { uid: string; email: string | null };
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

export const signUp = createAsyncThunk('auth/signUp', async ({ email, password, name }: { email: string; password: string; name: string }) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // You can store the name in Firestore here
    return { uid: userCredential.user.uid, email: userCredential.user.email };
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
        // Handle all auth async thunks here
    }
});

export default authSlice.reducer;