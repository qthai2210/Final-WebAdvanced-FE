import React from "react";
import TransactionItem from "@/components/dashboard/TransactionItem";
import { getUserAccounts } from "@/store/account/accountSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getMyTransactions } from "@/store/transaction/transactionSlice";
import { Transaction } from "@/types/transaction";

const TransactionHistoryPage = () => {
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [transactionType, setTransactionType] = React.useState("all");
  const { account } = useSelector((state: RootState) => state.account);
  const dispatch = useDispatch<AppDispatch>();

  const getTransactions = async (accountNumber: string) => {
    const fetchedTransactions = await dispatch(
      getMyTransactions({
        accountNumber,
        type: "all",
        limit: 1000,
      })
    ).unwrap();
    setTransactions(fetchedTransactions);
  };

  React.useEffect(() => {
    dispatch(getUserAccounts());
  }, [dispatch]);

  React.useEffect(() => {
    if (account?.accountNumber) {
      getTransactions(account.accountNumber);
    }
  }, [account?.accountNumber]);

  const filteredTransactions =
    transactionType === "all"
      ? transactions
      : transactions.filter(
          (transaction) => transaction.type === transactionType
        );

  return (
    <div className="text-center">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Transactions History
        </h2>
        <div>
          <label className="mr-4 text-gray-600">Filter by Type:</label>
          <select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
            className="p-2 border border-gray-300 rounded cursor-pointer"
          >
            <option value="all">All</option>
            <option value="receiver">Receiver</option>
            <option value="sender">Sender</option>
            <option value="debit">Debit</option>
          </select>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <i className="text-xl text-gray-600">No transaction found</i>
      ) : (
        filteredTransactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))
      )}
    </div>
  );
};

export default TransactionHistoryPage;
