import { configureStore } from '@reduxjs/toolkit';
import lotterieSlice from './lotterieSlice';

export const store = configureStore({
  reducer: {
    app: lotterieSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
