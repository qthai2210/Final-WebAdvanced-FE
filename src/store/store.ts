import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import debtReducer from "./debt/debtSlice";
import employeeReducer from "./employee/employeeSlice";
import adminReducer from "./admin/adminSlice";
import recipientReducer from "./recipient/recipientSlice";
import transactionReducer from "./transaction/transactionSlice";
import accountReducer from "./account/accountSlice";
import notificationsReducer from "./notifications/notificationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    debt: debtReducer,
    employee: employeeReducer,
    admin: adminReducer,
    recipient: recipientReducer,
    transaction: transactionReducer,
    account: accountReducer,
    notifications: notificationsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
