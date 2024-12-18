import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { saveNewRecipient } from "@/store/recipient/recipientSlice";
import { toast } from "react-toastify";
//import { RecipientDto } from "@/types/recipient.types";

interface Props {
  recipient: {
    accountNumber: string;
    nickname?: string;
  };
  onClose: () => void;
}

const SaveRecipientPrompt: React.FC<Props> = ({ recipient, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [nickname, setNickname] = useState(recipient.nickname || "");

  const handleSave = async () => {
    try {
      await dispatch(
        saveNewRecipient({
          accountNumber: recipient.accountNumber,
          nickname,
        })
      ).unwrap();
      toast.success("Recipient saved successfully");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save recipient");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Save Recipient</h2>
        <p className="mb-4">
          Would you like to save this recipient for future transfers?
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Nickname</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border rounded"
          >
            Skip
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveRecipientPrompt;
