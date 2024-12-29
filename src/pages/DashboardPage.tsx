import React from "react";
import CustomerOverview from "@/components/dashboard/CustomerOverview";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getMyTransactions } from "@/store/transaction/transactionSlice";
import { getUserAccounts } from "@/store/account/accountSlice";

const DashboardPage: React.FC = () => {
  const [mockTransactions, setMockTransactions] = React.useState([]);
  const { account } = useSelector((state: RootState) => state.account);
  const dispatch = useDispatch<AppDispatch>();

  const getTransactions = async (accountNumber: string) => {
    const transactions = await dispatch(
      getMyTransactions({
        accountNumber,
        type: "all",
      })
    ).unwrap();

    setMockTransactions(transactions);
  };

  React.useEffect(() => {
    dispatch(getUserAccounts());
  }, [dispatch]);

  React.useEffect(() => {
    if (account?.accountNumber) {
      getTransactions(account.accountNumber);
    }
  }, [account?.accountNumber]);

  return (
    <div className="space-y-6">
      <CustomerOverview />
      <QuickActions />
      <RecentTransactions transactions={mockTransactions.slice(0, 5)} />
    </div>
  );
};

export default DashboardPage;
