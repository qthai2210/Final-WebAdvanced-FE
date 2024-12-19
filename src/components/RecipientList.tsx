import React from "react";
import { useDispatch } from "react-redux";
import { SavedRecipient } from "@/types/recipient.types";
import {
  updateRecipient,
  removeRecipient,
} from "@/store/recipient/recipientSlice";
import { AppDispatch } from "@/store/store";

interface RecipientListProps {
  recipients?: SavedRecipient[];
  onEdit?: (recipient: SavedRecipient) => void;
}

const RecipientList: React.FC<RecipientListProps> = ({
  recipients = [],
  onEdit,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleDelete = async (accountNumber: string) => {
    if (window.confirm("Are you sure you want to delete this recipient?")) {
      try {
        await dispatch(removeRecipient(accountNumber)).unwrap();
      } catch (error) {
        console.error("Failed to delete recipient:", error);
      }
    }
  };

  if (!recipients || recipients.length === 0) {
    return <div className="text-center py-4">No recipients found</div>;
  }

  return (
    <div className="grid gap-4">
      {recipients.map((recipient) => (
        <div
          key={recipient.id}
          className="flex justify-between items-center p-4 bg-white rounded-lg shadow"
        >
          <div>
            <h3 className="font-medium">{recipient.nickname}</h3>
            <p className="text-sm text-gray-600">{recipient.accountNumber}</p>
          </div>
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(recipient)}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit
              </button>
            )}
            <button
              onClick={() => handleDelete(recipient.accountNumber)}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecipientList;
