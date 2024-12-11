import * as React from "react";
import { CreditCard, Send, History, Plus } from "lucide-react";

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Customer Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, John Doe
            </h1>
            <p className="text-gray-600">Account ending in 4242</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Available Balance</p>
            <p className="text-3xl font-bold text-blue-600">$12,345.67</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <Send className="h-6 w-6 text-blue-500 mr-3" />
          <span className="text-gray-700">Send Money</span>
        </button>
        <button className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <CreditCard className="h-6 w-6 text-blue-500 mr-3" />
          <span className="text-gray-700">Pay Bills</span>
        </button>
        <button className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <Plus className="h-6 w-6 text-blue-500 mr-3" />
          <span className="text-gray-700">Add Money</span>
        </button>
        <button className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <History className="h-6 w-6 text-blue-500 mr-3" />
          <span className="text-gray-700">History</span>
        </button>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Transactions
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="p-6 flex justify-between items-center"
            >
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === "credit"
                      ? "bg-green-100"
                      : "bg-red-100"
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
                  transaction.type === "credit"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {transaction.type === "credit" ? "+" : "-"}${transaction.amount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Mock data for transactions
const transactions = [
  {
    id: 1,
    description: "Deposit from Bank Transfer",
    amount: "1,250.00",
    date: "Today, 2:45 PM",
    type: "credit",
  },
  {
    id: 2,
    description: "Payment to Amazon",
    amount: "99.99",
    date: "Yesterday, 3:30 PM",
    type: "debit",
  },
  {
    id: 3,
    description: "Monthly Salary",
    amount: "4,500.00",
    date: "Mar 1, 2024",
    type: "credit",
  },
  {
    id: 4,
    description: "Utility Bill Payment",
    amount: "150.00",
    date: "Feb 28, 2024",
    type: "debit",
  },
] as const;

export default DashboardPage;
