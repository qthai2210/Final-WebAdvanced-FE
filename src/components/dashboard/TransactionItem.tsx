import React from "react";
import { Plus, Send } from "lucide-react";
import { Transaction } from "@/types/transaction";

const TransactionItem: React.FC<{ transaction: Transaction }> = ({
  transaction,
}) => {
  return (
    <div className="p-6 flex justify-between items-center">
      <div className="flex items-center">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            transaction.type === "credit" ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {transaction.type === "credit" ? (
            <Plus className={`h-5 w-5 text-green-600`} />
          ) : (
            <Send className={`h-5 w-5 text-red-600`} />
          )}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-900">
            {transaction.description}
          </p>
          <p className="text-sm text-gray-500">{transaction.date}</p>
        </div>
      </div>
      <div
        className={`text-sm font-medium ${
          transaction.type === "credit" ? "text-green-600" : "text-red-600"
        }`}
      >
        {transaction.type === "credit" ? "+" : "-"}${transaction.amount}
      </div>
    </div>
  );
};

export default TransactionItem;
