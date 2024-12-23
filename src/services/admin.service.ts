import { axiosInstance } from "../lib/axios";
import {
  CreateEmployeeDto,
  Employee,
  UpdateEmployeeDto,
  EmployeeFilter,
  PaginatedResponse,
} from "@/types/admin.types";

export const adminService = {
  // Employee management
  createEmployee: async (employeeData: CreateEmployeeDto) => {
    const response = await axiosInstance.post("/admin/employees", employeeData);
    return response.data;
  },

  getAllEmployees: async (
    filters?: EmployeeFilter
  ): Promise<PaginatedResponse<Employee>> => {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();

      if (filters) {
        if (filters.page) queryParams.append("page", filters.page.toString());
        if (filters.limit)
          queryParams.append("limit", filters.limit.toString());
        if (filters.search) queryParams.append("search", filters.search);
        if (filters.status) queryParams.append("status", filters.status);
        if (filters.sortBy) queryParams.append("sortBy", filters.sortBy);
        if (filters.sortOrder)
          queryParams.append("sortOrder", filters.sortOrder);
      }

      const response = await axiosInstance.get(
        `/admin/employees?${queryParams.toString()}`
      );

      console.log("API Raw Response:", response.data);

      // Handle nested data structure
      if (response.data && response.data.data) {
        return {
          data: response.data.data.data || [],
          metadata: response.data.data.metadata || {
            total: 0,
            page: 1,
            lastPage: 1,
            limit: 10,
          },
        };
      }

      // Return empty state if no valid data
      return {
        data: [],
        metadata: {
          total: 0,
          page: 1,
          lastPage: 1,
          limit: 10,
        },
      };
    } catch (error) {
      console.error("Error in getAllEmployees:", error);
      throw error;
    }
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
