import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { debtService } from "@/services/debt.service";
import {
  DebtSummary,
  SendPaymentOtpData,
  CancelDebtDto,
  PayDebtDto,
  SendPaymentOtpDto,
} from "@/types/debt.types";

interface DebtState {
  debts: any[];
  createdDebts: any[]; // Add this line
  loading: boolean;
  error: string | null;
  selectedDebt: any | null;
  summary: DebtSummary | null;
}

const initialState: DebtState = {
  debts: [], // Ensure this is initialized as empty array
  createdDebts: [], // Ensure this is initialized as empty array
  loading: false,
  error: null,
  selectedDebt: null,
  summary: null,
};

export const fetchDebts = createAsyncThunk(
  "debt/fetchDebts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await debtService.getMyDebts();
      console.log("my debts response:", response); // Add this for debugging
      return response; // Remove .data since getMyDebts already returns the data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch debts"
      );
    }
  }
);

export const fetchCreatedDebts = createAsyncThunk(
  "debt/fetchCreatedDebts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await debtService.getCreatedDebts();
      console.log("created debts response:", response); // Add this for debugging
      return response; // Add .data here if needed
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch created debts"
      );
    }
  }
);

export const createDebt = createAsyncThunk(
  "debt/createDebt",
  async (
    debtData: { accountNumber: string; amount: number; content: string },
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

export const sendPaymentOtp = createAsyncThunk(
  "debt/sendPaymentOtp",
  async (data: SendPaymentOtpDto, { rejectWithValue }) => {
    try {
      const response = await debtService.sendPaymentOtp(data);
      toast.success("OTP sent successfully");
      return response;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const cancelDebt = createAsyncThunk(
  "debt/cancelDebt",
  async (cancelData: CancelDebtDto, { rejectWithValue }) => {
    try {
      console.log("Cancel debt data:", cancelData); // Add this for debugging
      const response = await debtService.cancelDebt(cancelData);
      toast.success("Debt cancelled successfully");
      return response;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to cancel debt");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const payDebt = createAsyncThunk(
  "debt/payDebt",
  async (data: PayDebtDto, { rejectWithValue }) => {
    try {
      const response = await debtService.payDebt(data);
      toast.success("Debt paid successfully");
      return response;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to pay debt");
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
      // Fetch Created Debts
      .addCase(fetchCreatedDebts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCreatedDebts.fulfilled, (state, action) => {
        state.loading = false;
        state.createdDebts = action.payload;
      })
      .addCase(fetchCreatedDebts.rejected, (state, action) => {
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
      // Cancel Debt
      .addCase(cancelDebt.fulfilled, (state, action) => {
        const cancelledDebt = action.payload;

        // Check and update in created debts
        const createdDebtIndex = state.createdDebts.findIndex(
          (debt) => debt._id === cancelledDebt._id
        );
        if (createdDebtIndex !== -1) {
          state.createdDebts[createdDebtIndex] = cancelledDebt;
          return; // Exit early if found in created debts
        }

        // If not found in created debts, check and update in received debts
        const receivedDebtIndex = state.debts.findIndex(
          (debt) => debt._id === cancelledDebt._id
        );
        if (receivedDebtIndex !== -1) {
          state.debts[receivedDebtIndex] = cancelledDebt;
        }
      })
      // Pay Debt
      .addCase(payDebt.fulfilled, (state, action) => {
        const paidDebt = action.payload;
        const index = state.debts.findIndex(
          (debt) => debt._id === paidDebt._id
        );
        if (index !== -1) {
          state.debts[index] = paidDebt;
        }
      });
  },
});

export const { setSelectedDebt, clearSelectedDebt } = debtSlice.actions;
export default debtSlice.reducer;
