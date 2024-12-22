export interface TransactionFormData {
  toAccount: string;
  amount: number;
  content: string;
  feeType: "sender" | "receiver";
}

export interface TransactionOtpData {
  transactionId: string;
  otp: string;
}

export interface TransactionResponse {
  id: string;
  sourceAccountId: string;
  recipientAccountNumber: string;
  amount: number;
  content: string;
  feeType: "sender" | "receiver";
  status: "pending" | "completed" | "failed";
  createdAt: string;
}
