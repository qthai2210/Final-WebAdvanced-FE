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

export interface TransactionHistoryQueryDto {
  accountNumber: string;
  type: TransactionType;
  page?: number;
  limit?: number;
  fromDate?: Date;
  toDate?: Date;
}

export enum TransactionType {
  ALL = "all",
  RECEIVED = "received",
  SENT = "sent",
  DEBT_PAYMENT = "debt_payment",
}

export interface TransactionItem {
  _id: string;
  amount: number;
  content: string;
  status: string;
  type:
    | "external_receive"
    | "external_transfer"
    | "internal_transfer"
    | "internal_receive";
  fee: number;
  createdAt: string;
  fromUser: [
    {
      fullName: string;
    }
  ];
  toUser: [
    {
      fullName: string;
    }
  ];
}

export interface DepositMoneyCreateDto {
  accountNumber?: string;
  username?: string;
  amount: number;
}

export interface ReconciliationQueryDto {
  fromDate?: string;
  toDate?: string;
  bankId?: string;
  page?: number;
  limit?: number;
}

export interface ReconciliationTransaction {
  id: string;
  type: "sent" | "received";
  amount: number;
  fromAccount: string;
  toAccount: string;
  content: string;
  createdAt: string;
  status: "completed" | "pending" | "failed";
}

export interface BankReconciliationData {
  bankName: string;
  bankId: string | null;
  totalReceived: number;
  totalSent: number;
  transactionCount: number;
  transactions: ReconciliationTransaction[];
}

export interface ReconciliationResponseDto {
  totalAmount: number;
  totalTransactions: number;
  banks: BankReconciliationData[];
  metadata: {
    total: number;
    page: number;
    lastPage: number;
    limit: number;
  };
}
