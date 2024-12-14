import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

interface DebtDetailCardProps {
  debt: {
    _id: string;
    amount: number;
    content: string;
    status: "PENDING" | "PAID" | "CANCELLED";
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
}

export function DebtDetailCard({ debt, onPay, onCancel }: DebtDetailCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "PAID":
        return "success";
      case "CANCELLED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">
              {formatCurrency(debt.amount)}
            </CardTitle>
            <CardDescription>
              Created on {format(new Date(debt.createdAt), "PPP")}
            </CardDescription>
          </div>
          <Badge variant={getStatusColor(debt.status)}>{debt.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <span className="font-medium">From:</span>{" "}
            {debt.fromUserId.fullName}
          </div>
          <div>
            <span className="font-medium">To:</span> {debt.toUserId.fullName}
          </div>
          <div>
            <span className="font-medium">Description:</span> {debt.content}
          </div>
        </div>
      </CardContent>
      {debt.status === "PENDING" && (
        <CardFooter className="gap-2">
          {onPay && (
            <Button variant="default" onClick={() => onPay(debt._id)}>
              Pay Now
            </Button>
          )}
          {onCancel && (
            <Button variant="outline" onClick={() => onCancel(debt._id)}>
              Cancel
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
