import { UserRole, UserStatus } from "./user.types";

export interface CreateEmployeeDto {
  username: string;
  email: string;
  phone: string;
  fullName: string;
  password: string;
  identityNumber?: string;
  dateOfBirth?: Date;
  address?: string;
}

export interface Employee {
  id: string;
  username: string;
  email: string;
  phone: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
  identityNumber?: string;
  dateOfBirth?: Date;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateEmployeeDto extends Partial<CreateEmployeeDto> {
  status?: UserStatus;
}
