import { XMarkIcon, UserPlusIcon, UserIcon } from "@heroicons/react/24/outline";
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl transform transition-all">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <UserPlusIcon className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-800">
              {initialData ? "Edit Recipient" : "Add New Recipient"}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Account Number
            </label>
            <div className="relative">
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter account number with exactly 10 digits"
                maxLength={10}
                readOnly={initialData !== null}
              />
              <UserIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            {initialData && (
              <p className="text-sm text-gray-500 mt-1">
                Account number cannot be changed
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Nickname
            </label>
            <input
              type="text"
              value={formData.nickname}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, nickname: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter a nickname"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <UserPlusIcon className="h-5 w-5" />
              {initialData ? "Update" : "Add"} Recipient
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecipientForm;
