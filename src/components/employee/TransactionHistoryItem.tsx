import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { TransactionItem } from "@/types/transaction.types";
import { format } from "date-fns";

export function TransactionHistoryItem(props: TransactionItem) {
  const { amount, createdAt, status, fromUser, toUser, content } = props;

  return (
    <Card
      className={`mb-4 hover:shadow-lg transition-all duration-300 border-l-4`}
    >
      <CardHeader className={`bg-gradient-to-r to-white`}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle
              className={`text-xl font-bold bg-clip-text text-black bg-gradient-to-r`}
            >
              {formatCurrency(amount)}
            </CardTitle>
            <CardDescription className="text-gray-600 text-sm">
              Created on{" "}
              <span className={`font-medium`}>
                {format(new Date(createdAt), "PPP")}
              </span>
            </CardDescription>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase transform hover:scale-105 transition-all duration-200`}
          >
            {status}
          </div>
        </div>
      </CardHeader>
      <div className="flex justify-between items-center px-6 pb-6 hover:bg-gray-50/50 transition-colors duration-200">
        <CardContent className="p-0">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-gray-700">
              <span className="font-medium min-w-[4rem]">From:</span>
              <span className="text-blue-600 hover:text-blue-700 transition-colors">
                {fromUser[0].fullName}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <span className="font-medium min-w-[4rem]">To:</span>
              <span className="text-blue-600 hover:text-blue-700 transition-colors">
                {toUser[0].fullName}
              </span>
            </div>
            <div className="flex items-start space-x-2 text-gray-700">
              <span className="font-medium min-w-[4rem]">Note:</span>
              <span className="text-gray-600 italic">{content}</span>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
