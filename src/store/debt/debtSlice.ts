import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { debtService } from "@/services/debt.service";
import {
  DebtSummary,
  PayDebtData,
  SendPaymentOtpData,
} from "@/types/debt.types";

interface DebtState {
  debts: any[];
  loading: boolean;
  error: string | null;
  selectedDebt: any | null;
  summary: DebtSummary | null;
}

const initialState: DebtState = {
  debts: [],
  loading: false,
  error: null,
  selectedDebt: null,
  summary: null,
};

export const fetchDebts = createAsyncThunk(
  "debt/fetchDebts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await debtService.getDebts();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch debts"
      );
    }
  }
);

export const createDebt = createAsyncThunk(
  "debt/createDebt",
  async (
    debtData: { toUserId: string; amount: number; content: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await debtService.createDebt(debtData);
      toast.success("Debt created successfully");
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create debt");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchDebtSummary = createAsyncThunk(
  "debt/fetchSummary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await debtService.getDebtSummary();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch summary"
      );
    }
  }
);

export const payDebt = createAsyncThunk(
  "debt/payDebt",
  async (paymentData: PayDebtData, { rejectWithValue }) => {
    try {
      const response = await debtService.payDebt(paymentData);
      toast.success("Payment successful");
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Payment failed");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const sendPaymentOtp = createAsyncThunk(
  "debt/sendPaymentOtp",
  async (otpData: SendPaymentOtpData, { rejectWithValue }) => {
    try {
      const response = await debtService.sendPaymentOtp(otpData);
      toast.success("OTP sent successfully");
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const debtSlice = createSlice({
  name: "debt",
  initialState,
  reducers: {
    setSelectedDebt: (state, action) => {
      state.selectedDebt = action.payload;
    },
    clearSelectedDebt: (state) => {
      state.selectedDebt = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Debts
      .addCase(fetchDebts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDebts.fulfilled, (state, action) => {
        state.loading = false;
        state.debts = action.payload;
      })
      .addCase(fetchDebts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Debt
      .addCase(createDebt.fulfilled, (state, action) => {
        state.debts.push(action.payload);
      })
      // Fetch Summary
      .addCase(fetchDebtSummary.fulfilled, (state, action) => {
        state.summary = action.payload;
      })
      // Pay Debt
      .addCase(payDebt.fulfilled, (state, action) => {
        const updatedDebt = action.payload;
        const index = state.debts.findIndex(
          (debt) => debt.id === updatedDebt.id
        );
        if (index !== -1) {
          state.debts[index] = updatedDebt;
        }
      });
  },
});

export const { setSelectedDebt, clearSelectedDebt } = debtSlice.actions;
export default debtSlice.reducer;
