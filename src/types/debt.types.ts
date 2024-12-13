export interface DebtUser {
  _id: string;
  fullName: string;
  username: string;
}

export interface DebtDetail {
  _id: string;
  fromUser: DebtUser;
  toUser: DebtUser;
  amount: number;
  content: string;
  status: string;
  createdAt: Date;
}

export interface DebtSummary {
  totalLent: number;
  totalBorrowed: number;
  createdDebts: DebtDetail[];
  receivedDebts: DebtDetail[];
}

export interface PayDebtData {
  debtId: string;
  otp: string;
}

export interface SendPaymentOtpData {
  debtId: string;
}
