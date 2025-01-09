import React from "react";
import { Plus, Send, Wallet } from "lucide-react";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AssuredWorkloadIcon from "@mui/icons-material/AssuredWorkload";
import { Transaction } from "@/types/transaction";
import { format } from "date-fns";

const TransactionItem: React.FC<{ transaction: Transaction }> = ({
  transaction,
}) => {
  return (
    <div className="p-6 flex justify-between items-center">
      <div className="flex items-center">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            transaction.type === "receiver"
              ? transaction.isInternal
                ? "bg-green-100"
                : "bg-green-300"
              : transaction.type === "sender"
              ? transaction.isInternal
                ? "bg-blue-100"
                : "bg-blue-300"
              : "bg-red-100"
          }`}
        >
          {transaction.type === "receiver" ? (
            transaction.isInternal ? (
              <Plus className="h-5 w-5 text-green-600" />
            ) : (
              <AssuredWorkloadIcon className="h-5 w-5 text-green-600" />
            )
          ) : transaction.type === "sender" ? (
            transaction.isInternal ? (
              <Send className="h-5 w-5 text-blue-600" />
            ) : (
              <AccountBalanceIcon className="h-5 w-5 text-blue-600" />
            )
          ) : (
            <Wallet className="h-5 w-5 text-red-600" />
          )}
        </div>
        <div className="ml-4 text-left">
          <p className="text-sm font-medium text-gray-900">
            {transaction.description}
          </p>
          {!transaction.isInternal && (
            <p className="text-sm font-medium text-gray-900">
              {transaction.type === "receiver" ? "From bank: " : "To bank: "}
              {transaction.bankName}
            </p>
          )}
          <p className="text-sm font-medium text-gray-900">
            {transaction.type === "receiver"
              ? "From account: "
              : "To account: "}
            {transaction.accountNumber}
          </p>
          <p className="text-sm text-gray-500">
            {format(new Date(transaction.date), "dd/MM/yyyy HH:mm:ss")}
          </p>
        </div>
      </div>
      <div
        className={`text-sm font-medium ${
          transaction.type === "receiver" ? "text-green-600" : "text-red-600"
        }`}
      >
        {transaction.type === "receiver" ? "+" : "-"}$
        {new Intl.NumberFormat().format(transaction.amount)}
      </div>
    </div>
  );
};

export default TransactionItem;
