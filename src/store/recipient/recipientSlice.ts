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
  recipientInfo: RecipientInfo | null;
  savedRecipients: SavedRecipient[];
  loading: boolean;
  error: string | null;
}

const initialState: RecipientState = {
  recipientInfo: null,
  savedRecipients: [],
  loading: false,
  error: null,
};

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
      });
  },
});

export const { clearRecipientInfo } = recipientSlice.actions;
export default recipientSlice.reducer;
