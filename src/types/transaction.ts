export type Transaction = {
  id: string;
  description: string;
  amount: number;
  date: Date;
  type: "receiver" | "sender" | "debt";
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
