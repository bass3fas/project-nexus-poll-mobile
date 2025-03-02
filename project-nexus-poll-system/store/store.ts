import { configureStore } from '@reduxjs/toolkit';
import pollReducer from './slices/pollSlice';

export const store = configureStore({
    reducer: {
        poll: pollReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
});

// TypeScript helpers for type-safe usage
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;