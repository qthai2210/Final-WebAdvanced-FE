import { cancelDebt } from "@/store/debt/debtSlice";
import { axiosInstance } from "../lib/axios";
import {
  CancelDebtDto,
  DebtSummary,
  PayDebtData,
  SendPaymentOtpData,
  PayDebtDto,
  SendPaymentOtpDto,
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
  cancelDebt: async (data: CancelDebtDto) => {
    const response = await axiosInstance.post("/debts/cancel", data);
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

  sendPaymentOtp: async (data: SendPaymentOtpDto) => {
    const response = await axiosInstance.post("/debts/send-payment-otp", {
      debtId: data.debtId,
    });
    return response.data;
  },

  payDebt: async (data: PayDebtDto) => {
    const response = await axiosInstance.post("/debts/pay", {
      debtId: data.debtId,
      otp: data.otp,
    });
    return response.data;
  },
};
