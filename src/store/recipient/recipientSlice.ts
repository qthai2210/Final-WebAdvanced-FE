import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { recipientService } from "@/services/recipient.service";

interface RecipientState {
  recipients: any[];
  loading: boolean;
  error: string | null;
}

const initialState: RecipientState = {
  recipients: [],
  loading: false,
  error: null,
};

export const getMyRecipients = createAsyncThunk(
  "recipient/getMyRecipients",
  async (_, { rejectWithValue }) => {
    try {
      const response = await recipientService.getMyRecipients();
      console.log("your recipients response:", response);
      return response;
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to fetch your recipients"
      );
      return rejectWithValue((error.response?.data as any).message);
    }
  }
);

export const createRecipient = createAsyncThunk(
  "recipient/createRecipient",
  async (
    recipientData: { accountNumber: string; nickname?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await recipientService.createRecipient(recipientData);
      toast.success("Recipient created successfully");
      return response.data;
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to create recipient"
      );
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateRecipient = createAsyncThunk(
  "recipient/updateRecipient",
  async (
    recipientData: { accountNumber: string; nickname?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await recipientService.updateRecipient(recipientData);
      toast.success("Recipient created successfully");
      return response.data;
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to create recipient"
      );
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteRecipient = createAsyncThunk(
  "recipient/deleteRecipient",
  async (accountNumber: string, { rejectWithValue }) => {
    try {
      await recipientService.deleteRecipient(accountNumber);
      toast.success("Recipient deleted successfully");
      return accountNumber;
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to delete recipient"
      );
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const recipientSlice = createSlice({
  name: "recipient",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Recipients
      .addCase(getMyRecipients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyRecipients.fulfilled, (state, action) => {
        state.loading = false;
        state.recipients = action.payload;
      })
      .addCase(getMyRecipients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Recipients
      .addCase(createRecipient.fulfilled, (state, action) => {
        state.recipients.push(action.payload);
      })
      // Delete Recipient
      .addCase(deleteRecipient.fulfilled, (state, action) => {
        state.recipients = state.recipients.filter(
          (recipient) => recipient.accountNumber !== action.payload
        );
      });
  },
});

export const { clearError } = recipientSlice.actions;
export default recipientSlice.reducer;
