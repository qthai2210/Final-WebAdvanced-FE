import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import debtReducer from "./debt/debtSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    debt: debtReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
