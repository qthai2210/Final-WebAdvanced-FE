import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import accountReducer from "./account/accountSlice";
import recipientReducer from "./recipient/recipientSlice";
import debtReducer from "./debt/debtSlice";
import employeeReducer from "./employee/employeeSlice";
import adminReducer from "./admin/adminSlice";
import transactionReducer from "./transaction/transactionSlice";
import notificationsReducer from "./notifications/notificationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    account: accountReducer,
    recipient: recipientReducer,
    debt: debtReducer,
    employee: employeeReducer,
    admin: adminReducer,
    transaction: transactionReducer,
    notifications: notificationsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
