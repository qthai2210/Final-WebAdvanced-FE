import { axiosInstance } from "../lib/axios";
import {
  CreateEmployeeDto,
  Employee,
  UpdateEmployeeDto,
} from "@/types/admin.types";

export const adminService = {
  // Employee management
  createEmployee: async (employeeData: CreateEmployeeDto) => {
    const response = await axiosInstance.post("/admin/employees", employeeData);
    return response.data;
  },

  getAllEmployees: async (): Promise<Employee[]> => {
    const response = await axiosInstance.get("/admin/employees");
    return response.data;
  },

  getEmployeeById: async (id: string): Promise<Employee> => {
    const response = await axiosInstance.get(`/admin/employees/${id}`);
    return response.data;
  },

  updateEmployee: async (id: string, updateData: UpdateEmployeeDto) => {
    const response = await axiosInstance.put(
      `/admin/employees/${id}`,
      updateData
    );
    return response.data;
  },

  deleteEmployee: async (id: string) => {
    const response = await axiosInstance.delete(`/admin/employees/${id}`);
    return response.data;
  },

  validateToken: async () => {
    const response = await axiosInstance.get("/admin/employees/validate-token");
    return response.data;
  },
};
