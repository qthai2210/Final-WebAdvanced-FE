import { axiosInstance } from "../lib/axios";

interface RecipientDto {
  accountNumber: string;
  nickname?: string;
}

export const recipientService = {
  createRecipient: async (data: RecipientDto) => {
    const response = await axiosInstance.post("/recipients", data);
    return response.data;
  },

  getMyRecipients: async () => {
    const response = await axiosInstance.get("/recipients");
    return response.data;
  },

  updateRecipient: async (data: RecipientDto) => {
    const response = await axiosInstance.put("/recipients", data);
    return response.data;
  },

  deleteRecipient: async (accountNumber: string) => {
    const response = await axiosInstance.delete(`/recipients/${accountNumber}`);
    return response.data;
  },
};
