import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSavedRecipients,
  saveNewRecipient,
  updateRecipient,
} from "@/store/recipient/recipientSlice";
import RecipientList from "../components/RecipientList";
import { Recipient, RecipientDto } from "@/types/recipient.types";
import { AppDispatch, RootState } from "@/store/store";
import RecipientForm from "../components/RecipientForm";
import { setNavigationPath } from "@/store/auth/authSlice";
import { CircularProgress } from "@mui/material";
import {
  UserGroupIcon,
  ArrowRightIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

const RecipientListPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { savedRecipients, loading } = useSelector(
    (state: RootState) => state.recipient
  );
  console.log("RecipientListPage.tsx");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState<Recipient | null>(
    null
  );

  useEffect(() => {
    dispatch(fetchSavedRecipients());
  }, [dispatch]);

  const handleSubmit = async (data: RecipientDto) => {
    try {
      if (editingRecipient) {
        await dispatch(updateRecipient(data)).unwrap();
      } else {
        await dispatch(saveNewRecipient(data)).unwrap();
      }
      setIsFormOpen(false);
      setEditingRecipient(null);
      // Refresh the list after update/save
      dispatch(fetchSavedRecipients());
    } catch (error) {
      console.error("Failed to save/update recipient:", error);
    }
  };

  const handleEdit = (recipient: Recipient) => {
    setEditingRecipient(recipient);
    setIsFormOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex items-center gap-2">
          <CircularProgress size={24} />
          <span className="text-gray-600">Loading recipients...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <UserGroupIcon className="h-8 w-8 text-blue-500" />
        <h1 className="text-2xl font-bold text-gray-800">
          Recipients & Transfers
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => dispatch(setNavigationPath("/transactions/internal"))}
          className="flex items-center justify-between p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all transform hover:scale-105"
        >
          <div className="flex items-center gap-3">
            <UserGroupIcon className="h-6 w-6" />
            <span className="font-medium">Internal Transfer</span>
          </div>
          <ArrowRightIcon className="h-5 w-5" />
        </button>

        <button
          onClick={() => dispatch(setNavigationPath("/transactions/external"))}
          className="flex items-center justify-between p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105"
        >
          <div className="flex items-center gap-3">
            <BanknotesIcon className="h-6 w-6" />
            <span className="font-medium">External Transfer</span>
          </div>
          <ArrowRightIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <UserGroupIcon className="h-5 w-5 text-gray-600" />
          Saved Recipients
        </h2>
        <RecipientList recipients={savedRecipients || []} onEdit={handleEdit} />
      </div>

      {isFormOpen && (
        <RecipientForm
          initialData={editingRecipient}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingRecipient(null);
          }}
        />
      )}
    </div>
  );
};

export default RecipientListPage;
