import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SavedRecipient } from "@/types/recipient.types";
import {
  updateRecipient,
  removeRecipient,
} from "@/store/recipient/recipientSlice";
import { AppDispatch } from "@/store/store";
import { setNavigationPath } from "@/store/auth/authSlice";

interface RecipientListProps {
  recipients?: SavedRecipient[];
  onEdit?: (recipient: SavedRecipient) => void;
}

const RecipientList: React.FC<RecipientListProps> = ({
  recipients = [],
  onEdit,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleDelete = async (e: React.MouseEvent, accountNumber: string) => {
    e.stopPropagation(); // Prevent triggering the parent click
    if (window.confirm("Are you sure you want to delete this recipient?")) {
      try {
        await dispatch(removeRecipient(accountNumber)).unwrap();
      } catch (error) {
        console.error("Failed to delete recipient:", error);
      }
    }
  };

  const handleEdit = (e: React.MouseEvent, recipient: SavedRecipient) => {
    e.stopPropagation(); // Prevent triggering the parent click
    onEdit && onEdit(recipient);
  };

  const handleRecipientClick = (accountNumber: string) => {
    dispatch(
      setNavigationPath(`/transactions/internal?accountNumber=${accountNumber}`)
    );
    //navigate(`/transactions/internal?accountNumber=${accountNumber}`);
  };

  if (!recipients || recipients.length === 0) {
    return <div className="text-center py-4">No recipients found</div>;
  }

  return (
    <div className="grid gap-4">
      {recipients.map((recipient) => (
        <div
          key={recipient.id}
          onClick={() => handleRecipientClick(recipient.accountNumber)}
          className="flex justify-between items-center p-4 bg-white rounded-lg shadow hover:bg-gray-50 cursor-pointer"
        >
          <div>
            <h3 className="font-medium">{recipient.nickname}</h3>
            <p className="text-sm text-gray-600">{recipient.accountNumber}</p>
          </div>
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={(e) => handleEdit(e, recipient)}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit
              </button>
            )}
            <button
              onClick={(e) => handleDelete(e, recipient.accountNumber)}
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
