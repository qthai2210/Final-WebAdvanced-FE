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

export interface PaginatedMetadata {
  total: number;
  page: number;
  lastPage: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  metadata: PaginatedMetadata;
}

export interface EmployeeFilter {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: "createdAt" | "username" | "email" | "fullName";
  sortOrder?: "asc" | "desc";
}
