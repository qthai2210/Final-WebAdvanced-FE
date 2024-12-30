import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { X } from "lucide-react"; // Add this import

interface DebtDetailCardProps {
  debt: {
    _id: string;
    amount: number;
    content: string;
    status: "pending" | "paid" | "cancelled";
    createdAt: string;
    fromUserId: {
      fullName: string;
    };
    toUserId: {
      fullName: string;
    };
  };
  onPay?: (debtId: string) => void;
  onCancel?: (debtId: string) => void;
  isCreated?: boolean; // New prop to indicate if this is a created debt
}

export function DebtDetailCard({
  debt,
  onPay,
  onCancel,
  isCreated,
}: DebtDetailCardProps) {
  const getStatusConfig = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "pending":
        return {
          color: "warning",
          borderColor: "border-l-yellow-500",
          gradientFrom: "from-yellow-50",
          textGradient: "from-yellow-600 to-orange-600",
          amountText: "text-yellow-700",
          badgeBg: "bg-yellow-100",
          badgeText: "text-yellow-800",
          badgeRing: "ring-2 ring-yellow-500/20",
        };
      case "paid":
        return {
          color: "success",
          borderColor: "border-l-green-500",
          gradientFrom: "from-green-50",
          textGradient: "from-green-600 to-teal-600",
          amountText: "text-green-700",
          badgeBg: "bg-green-100",
          badgeText: "text-green-800",
          badgeRing: "ring-2 ring-green-500/20",
        };
      case "cancelled":
        return {
          color: "destructive",
          borderColor: "border-l-red-500",
          gradientFrom: "from-red-50",
          textGradient: "from-red-600 to-rose-600",
          amountText: "text-red-700",
          badgeBg: "bg-red-100",
          badgeText: "text-red-800",
          badgeRing: "ring-2 ring-red-500/20",
        };
      default:
        return {
          color: "secondary",
          borderColor: "border-l-blue-500",
          gradientFrom: "from-blue-50",
          textGradient: "from-blue-600 to-blue-800",
          amountText: "text-blue-700",
        };
    }
  };

  const statusConfig = getStatusConfig(debt.status);

  return (
    <Card
      className={`mb-4 hover:shadow-lg transition-all duration-300 border-l-4 ${statusConfig.borderColor}`}
    >
      <CardHeader
        className={`bg-gradient-to-r ${statusConfig.gradientFrom} to-white`}
      >
        <div className="flex justify-between items-start">
          <div>
            <CardTitle
              className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${statusConfig.textGradient}`}
            >
              {formatCurrency(debt.amount)}
            </CardTitle>
            <CardDescription className="text-gray-600 text-sm">
              Created on{" "}
              <span className={`font-medium ${statusConfig.amountText}`}>
                {format(new Date(debt.createdAt), "PPP")}
              </span>
            </CardDescription>
          </div>
          <div
            className={`
            px-3 py-1 rounded-full text-xs font-semibold tracking-wider
            ${statusConfig.badgeBg} ${statusConfig.badgeText} ${statusConfig.badgeRing}
            uppercase transform hover:scale-105 transition-all duration-200
          `}
          >
            {debt.status}
          </div>
        </div>
      </CardHeader>
      <div className="flex justify-between items-center px-6 pb-6 hover:bg-gray-50/50 transition-colors duration-200">
        <CardContent className="p-0">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-gray-700">
              <span className="font-medium min-w-[4rem]">From:</span>
              <span className="text-blue-600 hover:text-blue-700 transition-colors">
                {debt.fromUserId.fullName}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <span className="font-medium min-w-[4rem]">To:</span>
              <span className="text-blue-600 hover:text-blue-700 transition-colors">
                {debt.toUserId.fullName}
              </span>
            </div>
            <div className="flex items-start space-x-2 text-gray-700">
              <span className="font-medium min-w-[4rem]">Note:</span>
              <span className="text-gray-600 italic">{debt.content}</span>
            </div>
          </div>
        </CardContent>
        {debt.status === "pending" && (
          <div className="flex gap-4 ml-6">
            {!isCreated && onPay && (
              <Button
                variant="default"
                onClick={() => onPay(debt._id)}
                className="
                  relative overflow-hidden group
                  bg-gradient-to-r from-green-500 to-green-600
                  hover:from-green-600 hover:to-green-700
                  text-white font-semibold
                  shadow-md hover:shadow-lg
                  transition-all duration-300
                  px-8 py-2.5 rounded-lg
                  border-2 border-green-400
                  active:scale-95
                  after:absolute after:inset-0 after:rounded-lg
                  after:border-2 after:border-white/20
                  after:transform after:scale-105
                  after:opacity-0 hover:after:opacity-100
                  after:transition-all after:duration-300
                "
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span>Pay Now</span>
                </span>
                <div
                  className="
                  absolute inset-0 transform scale-x-0 group-hover:scale-x-100
                  bg-gradient-to-r from-green-600/50 to-green-700/50
                  transition-transform duration-300 origin-left
                "
                />
              </Button>
            )}
            {onCancel && (
              <Button
                variant="outline"
                onClick={() => onCancel(debt._id)}
                className="
                  relative overflow-hidden group
                  border-2 border-red-300
                  text-red-600 font-medium
                  hover:text-red-700
                  rounded-lg px-8 py-2.5
                  transition-all duration-300
                  active:scale-95
                  before:absolute before:inset-0
                  before:bg-red-50/0 hover:before:bg-red-50/100
                  before:transition-colors before:duration-300
                  after:absolute after:inset-0 after:rounded-lg
                  after:border after:border-red-200
                  after:transform after:scale-105
                  after:opacity-0 hover:after:opacity-100
                  after:transition-all after:duration-300
                  hover:border-red-400
                  hover:shadow-[0_0_15px_rgba(239,68,68,0.1)]
                "
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span>Cancel</span>
                  <X
                    className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 
                    -translate-x-4 group-hover:translate-x-0"
                  />
                </span>
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
