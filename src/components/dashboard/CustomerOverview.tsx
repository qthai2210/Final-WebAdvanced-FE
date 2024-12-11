import React from "react";

const CustomerOverview: React.FC = () => {
  return (
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
  );
};

export default CustomerOverview;
