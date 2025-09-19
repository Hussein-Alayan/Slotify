import { configureStore } from '@reduxjs/toolkit';
import servicesReducer from './services/servicesSlice';
import businessReducer from './businessSlice';

export const store = configureStore({
  reducer: {
    services: servicesReducer,
    business: businessReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

