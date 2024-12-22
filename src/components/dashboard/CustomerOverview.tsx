import { AppDispatch, RootState } from "@/store/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAccountByAccountNumber,
  getUserAccounts,
} from "@/store/account/accountSlice";
import { CircularProgress } from "@mui/material";

const CustomerOverview: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { account, accountByNumber, loading, error } = useSelector(
    (state: RootState) => state.account
  );

  React.useEffect(() => {
    dispatch(getUserAccounts());
  }, [dispatch]);

  React.useEffect(() => {
    if (account?.accountNumber) {
      dispatch(getAccountByAccountNumber(account.accountNumber));
    }
  }, [account, dispatch]);

  if (loading) {
    return (
      <div>
        <CircularProgress /> Getting account information...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {accountByNumber?.nickname}
          </h1>
          <p className="text-gray-600">
            Payment account number: {account?.accountNumber}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Available Balance</p>
          <p className="text-3xl font-bold text-blue-600">
            ${account?.balance}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerOverview;
