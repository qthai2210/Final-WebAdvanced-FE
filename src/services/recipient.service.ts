import { axiosInstance } from "../lib/axios";
import { RecipientDto, Recipient } from "@/types/recipient.types";

class RecipientService {
  async getRecipients(): Promise<Recipient[]> {
    const response = await axiosInstance.get("/recipients");
    return response.data;
  }

  async addRecipient(recipientDto: RecipientDto): Promise<Recipient> {
    const response = await axiosInstance.post("/recipients", recipientDto);
    console.log("addRecipient", response);
    return response.data;
  }

  async updateRecipient(recipientDto: RecipientDto): Promise<Recipient> {
    const response = await axiosInstance.put("/recipients", recipientDto);
    return response.data;
  }

  async removeRecipient(accountNumber: string): Promise<void> {
    await axiosInstance.delete(`/recipients/${accountNumber}`);
  }

  async getRecipientByAccount(accountNumber: string): Promise<Recipient> {
    const response = await axiosInstance.get(`/accounts/${accountNumber}`);
    return response.data;
  }
}

export const recipientService = new RecipientService();
