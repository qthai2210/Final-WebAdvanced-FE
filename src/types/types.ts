export enum UserRole {
  ADMIN = "administrator",
  USER = "user",
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  // ...other user properties
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalOrders: number;
  revenue: number;
}
