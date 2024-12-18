import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { accountService, AccountResponse } from "@/services/account.service";

interface AccountState {
  accounts: AccountResponse[];
  loading: boolean;
  error: string | null;
}

const initialState: AccountState = {
  accounts: [],
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

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export default accountSlice.reducer;
