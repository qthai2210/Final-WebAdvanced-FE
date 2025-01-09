import {
  ReconciliationQueryDto,
  ReconciliationResponseDto,
} from "@/types/transaction.types";
import { axiosInstance } from "../lib/axios";
import {
  CreateEmployeeDto,
  Employee,
  UpdateEmployeeDto,
  EmployeeFilter,
  PaginatedResponse,
} from "@/types/admin.types";

interface BankInfo {
  _id: string;
  name: string;
  code: string;
  apiEndpoint: string;
  isActive: boolean;
}

const transformReconciliationData = (
  response: any
): ReconciliationResponseDto => {
  // Group transactions by bank
  const bankTransactions = response.data.data.reduce(
    (acc: any, transaction: any) => {
      const bankId = transaction.bankId?._id || "unknown";
      const bankName = transaction.bankId?.name || "Unknown Bank";

      if (!acc[bankId]) {
        acc[bankId] = {
          bankName,
          bankId,
          totalReceived: 0,
          totalSent: 0,
          transactionCount: 0,
          transactions: [],
        };
      }

      const amount = transaction.amount;
      if (transaction.type === "external_receive") {
        acc[bankId].totalReceived += amount;
      } else if (transaction.type === "external_transfer") {
        acc[bankId].totalSent += amount;
      }

      acc[bankId].transactionCount++;
      acc[bankId].transactions.push({
        id: transaction._id,
        type: transaction.type === "external_receive" ? "received" : "sent",
        amount: transaction.amount,
        fromAccount: transaction.fromAccount,
        toAccount: transaction.toAccount,
        content: transaction.content,
        createdAt: transaction.createdAt,
        status: transaction.status,
      });

      return acc;
    },
    {}
  );

  // Calculate totals and format response
  const banks = Object.values(bankTransactions);
  const totalAmount = banks.reduce(
    (sum: number, bank: any) => sum + bank.totalReceived + bank.totalSent,
    0
  );
  const totalTransactions = banks.reduce(
    (sum: number, bank: any) => sum + bank.transactionCount,
    0
  );

  return {
    totalAmount,
    totalTransactions,
    banks,
    metadata: {
      total: parseInt(response.data.metadata.total),
      page: parseInt(response.data.metadata.page),
      lastPage: parseInt(response.data.metadata.lastPage),
      limit: parseInt(response.data.metadata.limit),
    },
  };
};

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
  async getReconciliationReport(
    query: ReconciliationQueryDto
  ): Promise<ReconciliationResponseDto> {
    const response = await axiosInstance.get(
      "/admin/employees/reconciliation",
      {
        params: query,
      }
    );
    return transformReconciliationData(response.data);
  },

  getCurrentBank: async (): Promise<BankInfo[]> => {
    const response = await axiosInstance.get("/external/banks");
    // Add console.log to debug the response
    console.log("Bank Info Response:", response.data);
    return response.data.data || response.data; // Handle both nested and direct response
  },
};
