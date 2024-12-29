import React from "react";
import { CreditCard, Send, History, Plus } from "lucide-react";
import { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";
import { setNavigationPath } from "@/store/auth/authSlice";

const QuickActionButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
  >
    <div className="h-6 w-6 text-blue-500 mr-3">{icon}</div>
    <span className="text-gray-700">{label}</span>
  </button>
);

const QuickActions: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <QuickActionButton
        icon={<Send />}
        label="Send Money"
        onClick={() => dispatch(setNavigationPath("/transactions"))}
      />
      <QuickActionButton icon={<CreditCard />} label="Pay Bills" />
      <QuickActionButton icon={<Plus />} label="Add Money" />
      <QuickActionButton
        icon={<History />}
        label="History"
        onClick={() => dispatch(setNavigationPath("/history"))}
      />
    </div>
  );
};

export default QuickActions;
