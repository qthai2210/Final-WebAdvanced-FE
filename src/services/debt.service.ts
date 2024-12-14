import { axiosInstance } from "../lib/axios";
import {
  DebtSummary,
  PayDebtData,
  SendPaymentOtpData,
} from "../types/debt.types";

interface CreateDebtDto {
  accountNumber: string; // Changed from toUserId
  amount: number;
  content: string;
}

export const debtService = {
  createDebt: async (data: CreateDebtDto) => {
    const response = await axiosInstance.post("/debts", data);
    return response.data;
  },

  // Add other debt-related service methods here
  getMyDebts: async () => {
    const response = await axiosInstance.get("/debts/my-debts");
    return response.data;
  },
  getCreatedDebts: async () => {
    const response = await axiosInstance.get("/debts/created-debts");
    return response.data;
  },

  getDebtSummary: async (): Promise<DebtSummary> => {
    const response = await axiosInstance.get("/debts/summary");
    return response.data;
  },

  payDebt: async (data: PayDebtData) => {
    const response = await axiosInstance.post("/debts/pay", data);
    return response.data;
  },

  sendPaymentOtp: async (data: SendPaymentOtpData) => {
    const response = await axiosInstance.post("/debts/send-payment-otp", data);
    return response.data;
  },
};
