import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { SavedRecipient } from "@/types/recipient.types";
import { removeRecipient } from "@/store/recipient/recipientSlice";
import { AppDispatch } from "@/store/store";
import { setNavigationPath } from "@/store/auth/authSlice";
import { ConfirmDialog } from "./ConfirmDialog";
import { UserIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

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
    return (
      <div className="text-center py-8 text-gray-500">
        <UserIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
        <p>No recipients found</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {recipients.map((recipient) => (
        <div
          key={recipient.id}
          onClick={() => handleRecipientClick(recipient.accountNumber)}
          className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer border border-gray-200"
        >
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <UserIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                {recipient.nickname}
              </h3>
              <p className="text-sm text-gray-600">{recipient.accountNumber}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={(e) => handleEdit(e, recipient)}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                title="Edit recipient"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={(e) => handleDeleteClick(e, recipient.accountNumber)}
              className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
              title="Delete recipient"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}

      <ConfirmDialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Recipient"
        message="Are you sure you want to remove this recipient from your list?"
      />
    </div>
  );
};

export default RecipientList;
