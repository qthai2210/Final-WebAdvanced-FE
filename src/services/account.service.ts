import axiosInstance from "@/lib/axios";

export interface AccountResponse {
  _id: string;
  accountNumber: string;
  userId: string;
  balance: number;
  type: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const accountService = {
  getMyAccounts: async (): Promise<AccountResponse[]> => {
    const response = await axiosInstance.get("/accounts");
    return Array.isArray(response.data) ? response.data : [response.data];
  },
};
