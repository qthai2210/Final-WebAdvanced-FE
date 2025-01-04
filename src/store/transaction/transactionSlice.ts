import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  TransactionHistory,
  transactionService,
} from "@/services/transaction.service";
import {
  TransactionFormData,
  TransactionOtpData,
} from "@/types/transaction.types";
import { Transaction } from "@/types/transaction";

interface TransactionState {
  transactions: Transaction[];
  currentTransfer: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  transactions: [],
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
      console.log("otpData", otpData);
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

export const getMyTransactions = createAsyncThunk(
  "transaction/getMyTransactions",
  async (query: TransactionHistory, { rejectWithValue }) => {
    try {
      const response = await transactionService.getMyTransactions(query);
      toast.success("Loading transaction history successfully");

      const transactions = response.map((fetchTransaction: any) => ({
        id: fetchTransaction._id,
        description: fetchTransaction.content,
        amount: fetchTransaction.amount,
        date: fetchTransaction.updatedAt,
        type:
          fetchTransaction.fromAccount === query.accountNumber
            ? fetchTransaction.type === "debt_payment"
              ? "debt"
              : "sender"
            : "receiver",
      }));

      return transactions;
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to load transaction history"
      );
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const initiateExternalTransfer = createAsyncThunk(
  "transaction/initiateExternalTransfer",
  async (transferData: TransactionFormData, { rejectWithValue }) => {
    try {
      const response = await transactionService.initiateExternalTransfer(
        transferData
      );
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
      .addCase(getMyTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(getMyTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(confirmTransfer.fulfilled, (state) => {
        state.currentTransfer = null;
      })
      .addCase(initiateExternalTransfer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initiateExternalTransfer.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTransfer = action.payload;
      })
      .addCase(initiateExternalTransfer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentTransfer } = transactionSlice.actions;
export default transactionSlice.reducer;
