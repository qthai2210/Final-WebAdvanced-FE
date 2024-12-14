import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import debtReducer from "./debt/debtSlice";
import employeeReducer from "./employee/employeeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    debt: debtReducer,
    employee: employeeReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
