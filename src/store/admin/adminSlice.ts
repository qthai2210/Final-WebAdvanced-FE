import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { adminService } from "@/services/admin.service";
import {
  CreateEmployeeDto,
  Employee,
  UpdateEmployeeDto,
  EmployeeFilter,
  PaginatedMetadata,
} from "@/types/admin.types";

interface AdminState {
  employees: {
    data: Employee[];
    metadata: PaginatedMetadata;
    loading: boolean;
    error: string | null;
  };
  selectedEmployee: Employee | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  employees: {
    data: [], // Ensure this is always an array
    metadata: {
      total: 0,
      page: 1,
      lastPage: 1,
      limit: 10,
    },
    loading: false,
    error: null,
  },
  selectedEmployee: null,
  loading: false,
  error: null,
};

// Async thunks
export const createEmployee = createAsyncThunk(
  "admin/createEmployee",
  async (employeeData: CreateEmployeeDto, { rejectWithValue }) => {
    try {
      const response = await adminService.createEmployee(employeeData);
      toast.success("Employee created successfully");
      return response;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create employee");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchEmployees = createAsyncThunk(
  "admin/fetchEmployees",
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminService.getAllEmployees();
      console.log("Raw API response:", response); // Debug log

      // If response is direct array
      if (Array.isArray(response)) {
        return {
          data: response,
          metadata: {
            total: response.length,
            page: 1,
            lastPage: 1,
            limit: response.length,
          },
        };
      }

      // If response has data property
      if (response && response.data) {
        return response;
      }

      throw new Error("Invalid response format");
    } catch (error: any) {
      console.error("Error in fetchEmployees:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch employees"
      );
    }
  }
);

export const updateEmployee = createAsyncThunk(
  "admin/updateEmployee",
  async (
    { id, data }: { id: string; data: UpdateEmployeeDto },
    { rejectWithValue }
  ) => {
    try {
      const response = await adminService.updateEmployee(id, data);
      toast.success("Employee updated successfully");
      return response;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update employee");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  "admin/deleteEmployee",
  async (id: string, { rejectWithValue }) => {
    try {
      await adminService.deleteEmployee(id);
      toast.success("Employee deleted successfully");
      return id;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete employee");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const getEmployees = createAsyncThunk(
  "admin/getEmployees",
  async (filters: EmployeeFilter, { rejectWithValue }) => {
    try {
      const response = await adminService.getAllEmployees(filters);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch employees"
      );
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setSelectedEmployee: (state, action) => {
      state.selectedEmployee = action.payload;
    },
    clearSelectedEmployee: (state) => {
      state.selectedEmployee = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch employees
      .addCase(fetchEmployees.pending, (state) => {
        state.employees.loading = true;
        state.employees.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.employees.loading = false;
        console.log("Action payload in reducer:", action.payload); // Debug log

        // Access the correct data path
        if (action.payload) {
          state.employees.data = action.payload.data;
          state.employees.metadata = action.payload.metadata;
        } else {
          state.employees.data = [];
          state.employees.metadata = {
            total: 0,
            page: 1,
            lastPage: 1,
            limit: 10,
          };
        }
        state.employees.error = null;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.employees.loading = false;
        state.employees.data = [];
        state.employees.error = action.payload as string;
      })
      // Create employee
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.employees.data.push(action.payload);
      })

      .addCase(createEmployee.rejected, (state, action) => {
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const index = state.employees.data.findIndex(
          (emp) => emp.id === action.payload.id
        );
        if (index !== -1) {
          state.employees.data[index] = action.payload;
        }
      })
      // Delete employee
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.employees.data = state.employees.data.filter(
          (emp) => emp.id !== action.payload
        );
      })
      .addCase(getEmployees.pending, (state) => {
        state.employees.loading = true;
        state.employees.error = null;
      })
      .addCase(getEmployees.fulfilled, (state, action) => {
        state.employees.loading = false;
        state.employees.data = action.payload.data;
        state.employees.metadata = action.payload.metadata;
      })
      .addCase(getEmployees.rejected, (state, action) => {
        state.employees.loading = false;
        state.employees.error = action.payload as string;
      });
  },
});

export const { setSelectedEmployee, clearSelectedEmployee } =
  adminSlice.actions;
export default adminSlice.reducer;
