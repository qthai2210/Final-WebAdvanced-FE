export interface TransactionFormData {
  toAccount: string;
  amount: number;
  content: string;
  feeType: "sender" | "receiver";
  bankId?: string;
}

export interface TransactionOtpData {
  transactionId: string;
  otp: string;
  type: "internal" | "external";
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
