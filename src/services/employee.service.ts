import { axiosInstance } from "../lib/axios";
import { RegisterWithoutPasswordDto, UserRole } from "@/types/user.types";

export const employeeService = {
  createCustomerAccount: async (userData: RegisterWithoutPasswordDto) => {
    const response = await axiosInstance.post("/auth/register-with-otp", {
      ...userData,
      role: UserRole.CUSTOMER.toLowerCase(), // Convert to lowercase to match backend expectation
    });
    return response.data;
  },

  //   getAllCustomers: async (): Promise<CustomerResponse[]> => {
  //     const response = await axiosInstance.get("/employee/customers");
  //     return response.data;
  //   },

  //   getCustomerById: async (id: string): Promise<CustomerResponse> => {
  //     const response = await axiosInstance.get(`/employee/customers/${id}`);
  //     return response.data;
  //   },

  //   updateCustomer: async (id: string, userData: Partial<RegisterWithoutPasswordDto>) => {
  //     const response = await axiosInstance.patch(`/employee/customers/${id}`, userData);
  //     return response.data;
  //   },

  //   deleteCustomer: async (id: string) => {
  //     const response = await axiosInstance.delete(`/employee/customers/${id}`);
  //     return response.data;
  //   },

  verifyOtp: async (email: string, otp: string) => {
    const response = await axiosInstance.post("/auth/verify-register-otp", {
      email,
      otp,
    });
    return response.data;
  },
};
