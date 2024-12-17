export interface RecipientDto {
  accountNumber: string;
  nickname: string;
  bankCode?: string;
}

export interface Recipient extends RecipientDto {
  id?: string;
  _id?: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecipientDto {
  accountNumber: string;
  name: string;
  bankId?: string;
}

export interface RecipientInfo {
  accountNumber: string;
  nickname: string;
}

export interface SavedRecipient extends Recipient {
  id: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
}
