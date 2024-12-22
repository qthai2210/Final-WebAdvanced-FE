import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { recipientService } from "@/services/recipient.service";
import {
  RecipientInfo,
  SavedRecipient,
  Recipient,
  RecipientDto,
} from "@/types/recipient.types";

interface RecipientState {
  recipients: any[];
  recipientInfo: RecipientInfo | null;
  savedRecipients: SavedRecipient[];
  loading: boolean;
  error: string | null;
}

const initialState: RecipientState = {
  recipients: [],
  recipientInfo: null,
  savedRecipients: [],
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

export const fetchSavedRecipients = createAsyncThunk(
  "recipient/fetchSavedRecipients",
  async (_, { rejectWithValue }) => {
    try {
      const response = await recipientService.getRecipients();
      console.log("fetchSavedRecipients", response);

      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch saved recipients"
      );
    }
  }
);

export const saveNewRecipient = createAsyncThunk(
  "recipient/saveNewRecipient",
  async (recipientData: RecipientDto, { rejectWithValue }) => {
    try {
      const response = await recipientService.addRecipient(recipientData);
      toast.success("Recipient saved successfully");
      return response;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save recipient");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchRecipientByAccount = createAsyncThunk(
  "recipient/fetchRecipientByAccount",
  async (accountNumber: string, { rejectWithValue }) => {
    try {
      return await recipientService.getRecipientByAccount(accountNumber);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch recipient info"
      );
    }
  }
);

export const updateRecipient = createAsyncThunk(
  "recipient/updateRecipient",
  async (recipientData: RecipientDto, { rejectWithValue }) => {
    try {
      const response = await recipientService.updateRecipient(recipientData);
      toast.success("Recipient updated successfully");
      return response;
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update recipient"
      );
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const removeRecipient = createAsyncThunk(
  "recipient/removeRecipient",
  async (accountNumber: string, { rejectWithValue }) => {
    try {
      await recipientService.removeRecipient(accountNumber);
      toast.success("Recipient removed successfully");
      return accountNumber;
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to remove recipient"
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
    clearRecipientInfo: (state) => {
      state.recipientInfo = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSavedRecipients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavedRecipients.fulfilled, (state, action) => {
        state.loading = false;
        state.savedRecipients = action.payload.map((recipient: Recipient) => ({
          ...recipient,
          id: recipient._id || "",
          nickname: recipient.nickname || "",
        }));
      })
      .addCase(fetchSavedRecipients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchRecipientByAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.recipientInfo = {
          ...action.payload,
          nickname: action.payload.nickname || "",
        };
      })
      .addCase(fetchRecipientByAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(saveNewRecipient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveNewRecipient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(saveNewRecipient.fulfilled, (state, action) => {
        state.loading = false;
        state.savedRecipients.push({
          ...action.payload,
          id: action.payload._id || "",
          nickname: action.payload.nickname || "",
        });
      })
      // Update recipient
      .addCase(updateRecipient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRecipient.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.savedRecipients.findIndex(
          (recipient) =>
            recipient.accountNumber === action.payload.accountNumber
        );
        if (index !== -1) {
          state.savedRecipients[index] = {
            ...action.payload,
            id: action.payload._id || "",
            nickname: action.payload.nickname || "",
          };
        }
      })
      .addCase(updateRecipient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Remove recipient
      .addCase(removeRecipient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeRecipient.fulfilled, (state, action) => {
        state.loading = false;
        state.savedRecipients = state.savedRecipients.filter(
          (recipient) => recipient.accountNumber !== action.payload
        );
      })
      .addCase(removeRecipient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
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

export const { clearError, clearRecipientInfo } = recipientSlice.actions;
export default recipientSlice.reducer;
