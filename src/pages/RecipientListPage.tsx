import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSavedRecipients,
  saveNewRecipient,
} from "@/store/recipient/recipientSlice";
import RecipientList from "../components/RecipientList";
import { Recipient, RecipientDto } from "@/types/recipient.types";
import { AppDispatch, RootState } from "@/store/store";
import RecipientForm from "../components/RecipientForm";

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
    if (editingRecipient) {
      //await dispatch(updateRecipient(data));
    } else {
      await dispatch(saveNewRecipient(data));
    }
    setIsFormOpen(false);
    setEditingRecipient(null);
  };

  const handleEdit = (recipient: Recipient) => {
    setEditingRecipient(recipient);
    setIsFormOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Recipients</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Add New Recipient
        </button>
      </div>

      <RecipientList recipients={savedRecipients || []} onEdit={handleEdit} />

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