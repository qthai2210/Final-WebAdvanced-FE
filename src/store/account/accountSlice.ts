import { toast } from "react-toastify";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { accountService, AccountResponse } from "@/services/account.service";

interface AccountState {
  accounts: AccountResponse[];
  account: any;
  accountByNumber: any;
  loading: boolean;
  error: string | null;
}

const initialState: AccountState = {
  accounts: [],
  account: null,
  accountByNumber: null,
  loading: false,
  error: null,
};

export const fetchUserAccounts = createAsyncThunk(
  "account/fetchUserAccounts",
  async () => {
    const accounts = await accountService.getMyAccounts();
    return accounts;
  }
);

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
      //Fetch Accounts
      .addCase(fetchUserAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload;
      })
      .addCase(fetchUserAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch accounts";
      })
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
