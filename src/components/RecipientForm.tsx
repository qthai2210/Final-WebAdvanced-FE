import React, { useState } from "react";
import { Recipient, RecipientDto } from "@/types/recipient.types";
import { useDispatch } from "react-redux";
import { fetchRecipientByAccount } from "@/store/recipient/recipientSlice";
import { AppDispatch } from "@/store/store";

interface RecipientFormProps {
  initialData?: Recipient | null;
  onSubmit: (data: RecipientDto) => void;
  onCancel: () => void;
}

const RecipientForm: React.FC<RecipientFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<RecipientDto>({
    accountNumber: initialData?.accountNumber || "",
    nickname: initialData?.nickname || "",
    bankCode: initialData?.bankCode || "BANK",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.accountNumber) {
      setError("Account number is required");
      return;
    }
    try {
      await onSubmit(formData);
    } catch (err) {
      console.log(err);
      setError("Failed to save recipient");
    }
  };

  const handleAccountBlur = async () => {
    if (formData.accountNumber.length >= 10) {
      try {
        const response = await dispatch(
          fetchRecipientByAccount(formData.accountNumber)
        ).unwrap();
        if (response) {
          setFormData((prev) => ({
            ...prev,
            nickname: response.nickname || prev.nickname,
          }));
        }
      } catch (err) {
        console.log(err);
        setError("Account not found");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? "Edit Recipient" : "Add New Recipient"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Account Number
            </label>
            <input
              type="text"
              value={formData.accountNumber}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  accountNumber: e.target.value,
                }))
              }
              onBlur={handleAccountBlur}
              className={`w-full p-2 border rounded ${
                initialData ? "bg-gray-100" : ""
              }`}
              readOnly={initialData !== null}
              placeholder="Enter account number with exactly 10 digits"
              maxLength={10}
            />
            {initialData && (
              <p className="text-sm text-gray-500 mt-1">
                Account number cannot be changed
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nickname</label>
            <input
              type="text"
              value={formData.nickname}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, nickname: e.target.value }))
              }
              className="w-full p-2 border rounded"
              placeholder="Enter nickname"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              {initialData ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecipientForm;
