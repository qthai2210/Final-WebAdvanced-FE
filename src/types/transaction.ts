export type Transaction = {
  id: number;
  description: string;
  amount: string;
  date: string;
  type: "credit" | "debit";
};

export interface TransferFormData {
  toAccount: string;
  amount: number;
  content: string;
  feeType: "sender" | "receiver";
}

export interface TransferOtpData {
  transactionId: string;
  otp: string;
}

export interface TransferResponse {
  id: string;
  sourceAccountId: string;
  recipientAccountNumber: string;
  amount: number;
  content: string;
  feeType: "SENDER" | "RECEIVER";
  status: "PENDING" | "COMPLETED" | "FAILED";
  createdAt: string;
}

export const mockTransactions: readonly Transaction[] = [
  {
    id: 1,
    description: "Deposit from Bank Transfer",
    amount: "1,250.00",
    date: "Today, 2:45 PM",
    type: "credit",
  },
  // add more mock data
  {
    id: 2,
    description: "Payment for groceries",
    amount: "250.00",
    date: "Today, 1:45 PM",
    type: "debit",
  },

  // ...existing mock data...
] as const;
