import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { transactionService } from "@/services/transaction.service";
import {
  TransactionFormData,
  TransactionOtpData,
} from "@/types/transaction.types";

interface TransactionState {
  currentTransfer: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  currentTransfer: null,
  loading: false,
  error: null,
};

export const initiateTransfer = createAsyncThunk(
  "transaction/initiateTransfer",
  async (transferData: TransactionFormData, { rejectWithValue }) => {
    try {
      const response = await transactionService.initiateTransfer(transferData);
      toast.success("Transfer initiated. Please check your email for OTP");
      return response;
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to initiate transfer"
      );
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const confirmTransfer = createAsyncThunk(
  "transaction/confirmTransfer",
  async (otpData: TransactionOtpData, { rejectWithValue }) => {
    try {
      const response = await transactionService.confirmTransfer(otpData);
      toast.success("Transfer completed successfully");
      return response;
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to confirm transfer"
      );
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    clearCurrentTransfer: (state) => {
      state.currentTransfer = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiateTransfer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initiateTransfer.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTransfer = action.payload;
      })
      .addCase(initiateTransfer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(confirmTransfer.fulfilled, (state) => {
        state.currentTransfer = null;
      });
  },
});

export const { clearCurrentTransfer } = transactionSlice.actions;
export default transactionSlice.reducer;
