import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { SavedRecipient } from "@/types/recipient.types";
import { removeRecipient } from "@/store/recipient/recipientSlice";
import { AppDispatch } from "@/store/store";
import { setNavigationPath } from "@/store/auth/authSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ConfirmDialog } from "./ConfirmDialog";

interface RecipientListProps {
  recipients?: SavedRecipient[];
  onEdit?: (recipient: SavedRecipient) => void;
}

const RecipientList: React.FC<RecipientListProps> = ({
  recipients = [],
  onEdit,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedAccountNumber, setSelectedAccountNumber] = useState<
    string | null
  >(null);

  const handleEdit = (e: React.MouseEvent, recipient: SavedRecipient) => {
    e.stopPropagation(); // Prevent triggering the parent click
    if (onEdit) {
      onEdit(recipient);
    }
  };

  const handleRecipientClick = (accountNumber: string) => {
    dispatch(
      setNavigationPath(`/transactions/internal?accountNumber=${accountNumber}`)
    );
    //navigate(`/transactions/internal?accountNumber=${accountNumber}`);
  };

  const handleDeleteClick = (e: React.MouseEvent, accountNumber: string) => {
    e.stopPropagation(); // Prevent triggering the parent click
    setSelectedAccountNumber(accountNumber);
    setIsConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (selectedAccountNumber) {
      try {
        await dispatch(removeRecipient(selectedAccountNumber)).unwrap();
        setIsConfirmOpen(false);
        setSelectedAccountNumber(null);
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
                <EditIcon fontSize="small" />
              </button>
            )}
            <button
              onClick={(e) => handleDeleteClick(e, recipient.accountNumber)}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
              <DeleteIcon fontSize="small" />
            </button>
          </div>
        </div>
      ))}

      <ConfirmDialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this recipient?"
      />
    </div>
  );
};

export default RecipientList;
