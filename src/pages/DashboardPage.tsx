import React from "react";
import CustomerOverview from "@/components/dashboard/CustomerOverview";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import { mockTransactions } from "@/types/transaction";

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <CustomerOverview />
      <QuickActions />
      <RecentTransactions transactions={mockTransactions} />
    </div>
  );
};

export default DashboardPage;
