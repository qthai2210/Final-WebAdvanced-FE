import { axiosInstance } from "../lib/axios";

export const accountService = {
  getUserAccounts: async () => {
    const response = await axiosInstance.get("/accounts");
    return response.data;
  },

  getAccountByAccountNumber: async (accountNumber: string) => {
    const response = await axiosInstance.get(`/accounts/${accountNumber}`);
    return response.data;
  },
};
