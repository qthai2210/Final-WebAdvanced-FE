import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { accountService } from "@/services/account.service";

interface AccountState {
  account: any;
  accountByNumber: any;
  loading: boolean;
  error: string | null;
}

const initialState: AccountState = {
  account: null,
  accountByNumber: null,
  loading: false,
  error: null,
};

export const getUserAccounts = createAsyncThunk(
  "account/getUserAccounts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await accountService.getUserAccounts();
      console.log("your accounts response:", response);
      return response;
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to fetch your accounts"
      );
      return rejectWithValue((error.response?.data as any).message);
    }
  }
);

export const getAccountByAccountNumber = createAsyncThunk(
  "account/getAccountByAccountNumber",
  async (accountNumber: string, { rejectWithValue }) => {
    try {
      const response = await accountService.getAccountByAccountNumber(
        accountNumber
      );
      console.log("your accounts response:", response);
      return response;
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to fetch your accounts"
      );
      return rejectWithValue((error.response?.data as any).message);
    }
  }
);

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Account
      .addCase(getUserAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.account = action.payload;
      })
      .addCase(getUserAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Account with number
      .addCase(getAccountByAccountNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAccountByAccountNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.accountByNumber = action.payload;
      })
      .addCase(getAccountByAccountNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = accountSlice.actions;
export default accountSlice.reducer;
