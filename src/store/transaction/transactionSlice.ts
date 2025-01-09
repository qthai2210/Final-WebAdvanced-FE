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
  externalAccountInfo: any | null; // Add this
  loadingExternalInfo: boolean; // Add this
}

const initialState: TransactionState = {
  transactions: [],
  currentTransfer: null,
  loading: false,
  error: null,
  externalAccountInfo: null, // Add this
  loadingExternalInfo: false, // Add this
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
        accountNumber:
          fetchTransaction.fromAccount === query.accountNumber
            ? fetchTransaction.toAccount
            : fetchTransaction.fromAccount,
        bankName: fetchTransaction.bankName,
        date: fetchTransaction.updatedAt,
        isInternal: ["i", "d"].includes(fetchTransaction.type[0])
          ? true
          : false,
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

// Add new thunk
export const getExternalAccountInfo = createAsyncThunk(
  "transaction/getExternalAccountInfo",
  async (
    { accountNumber, bankId }: { accountNumber: string; bankId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await transactionService.getExternalAccountInfo(
        accountNumber,
        bankId
      );
      return response.data;
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to get account information"
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
    // ...existing reducers...
    clearExternalAccountInfo: (state) => {
      state.externalAccountInfo = null;
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
      })
      // Get External Account Info
      .addCase(getExternalAccountInfo.pending, (state) => {
        state.loadingExternalInfo = true;
        state.error = null;
      })
      .addCase(getExternalAccountInfo.fulfilled, (state, action) => {
        state.loadingExternalInfo = false;
        state.externalAccountInfo = action.payload;
      })
      .addCase(getExternalAccountInfo.rejected, (state, action) => {
        state.loadingExternalInfo = false;
        state.error = action.payload as string;
        state.externalAccountInfo = null;
      });
  },
});

export const { clearCurrentTransfer, clearExternalAccountInfo } =
  transactionSlice.actions;
export default transactionSlice.reducer;
