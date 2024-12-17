import React from "react";
import { SavedRecipient } from "@/types/recipient.types";
interface RecipientListProps {
  recipients?: SavedRecipient[];
  onEdit?: (recipient: SavedRecipient) => void;
}

const RecipientList: React.FC<RecipientListProps> = ({
  recipients = [], // Provide default empty array
  onEdit,
}) => {
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
          {onEdit && (
            <button
              onClick={() => onEdit(recipient)}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
            >
              Edit
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default RecipientList;
