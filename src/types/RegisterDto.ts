export enum UserRole {
  CUSTOMER = "CUSTOMER",
  ADMIN = "ADMIN",
}

export interface RegisterDto {
  username: string;
  password: string;
  email: string;
  phone: string;
  fullName: string;
  identityNumber?: string;
  dateOfBirth?: Date;
  address?: string;
  role?: UserRole;
}
