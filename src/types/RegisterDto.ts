import { UserRole } from "./Enums/User.enum";

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
