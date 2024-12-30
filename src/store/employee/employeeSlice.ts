import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { employeeService } from "@/services/employee.service";
import { RegisterWithoutPasswordDto } from "@/types/user.types";
import { DepositMoneyCreateDto, TransactionHistoryQueryDto } from "@/types/transaction.types";

interface CustomerState {
  customers: any[];
  loading: boolean;
  error: string | null;
  userCreationLoading: boolean;
  userCreationError: string | null;
  verificationLoading: boolean;
  verificationError: string | null;
  data: any | null;
}

const initialState: CustomerState = {
  customers: [],
  loading: false,
  error: null,
  userCreationLoading: false,
  userCreationError: null,
  verificationLoading: false,
  verificationError: null,
  data: [],
};

export const createUserAccount = createAsyncThunk(
  "employee/createUserAccount",
  async (userData: RegisterWithoutPasswordDto, { rejectWithValue }) => {
    try {
      console.log("userData", userData);
      const response = await employeeService.createCustomerAccount(userData);
      console.log("customer account created:", response);
      toast.success("Customer account created successfully");
      return response;
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to create customer account"
      );
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const verifyUserOtp = createAsyncThunk(
  "employee/verifyOtp",
  async (
    { email, otp }: { email: string; otp: string },
    { rejectWithValue }
  ) => {
    try {
      console.log("Verifying OTP for email:", email);
      const response = await employeeService.verifyOtp(email, otp);
      toast.success(
        "Account verified successfully. Password has been sent to email."
      );
      return { email, ...response };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "OTP verification failed";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk to fetch transaction history
export const fetchTransactionHistory = createAsyncThunk(
  "transactions/history",
  async (query: TransactionHistoryQueryDto, { rejectWithValue }) => {
    try {
      const response = await employeeService.getTransactionHistory(query);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const depositMoney = createAsyncThunk(
  'employee/deposit-money',
  async (depositData: DepositMoneyCreateDto, { rejectWithValue }) => {
    try {
      const response = await employeeService.depositMoney(depositData);
      console.log(response)
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred while depositing money.');
    }
  }
);

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(createUserAccount.pending, (state) => {
        state.userCreationLoading = true;
        state.userCreationError = null;
      })
      .addCase(createUserAccount.fulfilled, (state, action) => {
        state.userCreationLoading = false;
        state.customers.push(action.payload);
      })
      .addCase(createUserAccount.rejected, (state, action) => {
        state.userCreationLoading = false;
        state.userCreationError = action.payload as string;
      })
      .addCase(verifyUserOtp.pending, (state) => {
        state.verificationLoading = true;
        state.verificationError = null;
      })
      .addCase(verifyUserOtp.fulfilled, (state, action) => {
        state.verificationLoading = false;
        const verifiedUser = state.customers.find(
          (customer) => customer.email === action.payload.email
        );
        if (verifiedUser) {
          verifiedUser.isVerified = true;
        }
      })
      .addCase(verifyUserOtp.rejected, (state, action) => {
        state.verificationLoading = false;
        state.verificationError = action.payload as string;
      })
      .addCase(fetchTransactionHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactionHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchTransactionHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(depositMoney.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(depositMoney.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(depositMoney.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
});

//export const {  } = employeeSlice.actions;
export default employeeSlice.reducer;
