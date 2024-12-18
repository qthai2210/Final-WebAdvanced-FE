export interface RecipientDto {
  accountNumber: string;
  nickname?: string;
  bankCode?: string;
}

export interface Recipient {
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

export interface CreateRecipientDto {
  accountNumber: string;
  name?: string;
  bankId?: string;
}

export interface RecipientInfo {
  accountNumber: string;
  nickname?: string;
}

export interface SavedRecipient extends Recipient {
  id: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
}
