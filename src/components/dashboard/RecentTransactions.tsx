import React from "react";
import TransactionItem from "./TransactionItem";
import { Transaction } from "@/types/transaction";

interface RecentTransactionsProps {
  transactions: readonly Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
}) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          Recent Transactions
        </h2>
      </div>
      <div className="divide-y divide-gray-200">
        {transactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
