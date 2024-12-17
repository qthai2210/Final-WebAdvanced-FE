import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { adminService } from "@/services/admin.service";
import {
  CreateEmployeeDto,
  Employee,
  UpdateEmployeeDto,
} from "@/types/admin.types";

interface AdminState {
  employees: Employee[];
  selectedEmployee: Employee | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  employees: [],
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
      return await adminService.getAllEmployees();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch employees");
      return rejectWithValue(error.response?.data?.message);
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
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create employee
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.employees.push(action.payload);
      })
      // Update employee
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const index = state.employees.findIndex(
          (emp) => emp.id === action.payload.id
        );
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
      })
      // Delete employee
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.employees = state.employees.filter(
          (emp) => emp.id !== action.payload
        );
      });
  },
});

export const { setSelectedEmployee, clearSelectedEmployee } =
  adminSlice.actions;
export default adminSlice.reducer;
