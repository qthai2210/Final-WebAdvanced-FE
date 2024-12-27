import { axiosInstance } from "../lib/axios";
import {
  TransactionFormData,
  TransactionOtpData,
} from "@/types/transaction.types";

interface CreateTransactionDto {
  toAccount: string;
  amount: number;
  content: string;
  feeType: "sender" | "receiver";
  bankId?: string;
}

interface TransactionHistory {
  accountNumber: string;
  type?: "all" | "received" | "sent" | "debt_payment";
  page?: number;
  limit?: number;
  fromDate?: Date;
  toDate?: Date;
}

class TransactionService {
  async initiateTransfer(transferData: TransactionFormData) {
    const response = await axiosInstance.post(
      "/transactions/internal-transfer",
      transferData
    );
    return response.data;
  }

  async confirmTransfer(otpData: TransactionOtpData) {
    const response = await axiosInstance.post(
      "/transactions/verify-otp",
      otpData
    );
    return response.data;
  }

  async resendOtp(transferId: string) {
    const response = await axiosInstance.post(
      `/transfers/${transferId}/resend-otp`
    );
    return response.data;
  }

  async createTransaction(data: CreateTransactionDto) {
    const response = await axiosInstance.post(
      "/transactions/internal-transfer",
      data
    );
    return response.data;
  }

  async getMyTransactions(query: TransactionHistory) {
    const response = await axiosInstance.get("/transactions/history", {
      params: query,
    });
    return response.data;
  }

  async initiateExternalTransfer(transferData: TransactionFormData) {
    const response = await axiosInstance.post(
      "/transactions/external-transfer",
      transferData
    );
    return response.data;
  }
}

export const transactionService = new TransactionService();
