import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchRecipientByAccount } from "@/store/recipient/recipientSlice";
import { Recipient } from "@/types/recipient.types";
import { toast } from "react-toastify";
import {
  UserIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { UserGroupIcon } from "@heroicons/react/24/solid";

interface Props {
  onSelect: (recipient: Recipient) => void;
  accountNumber?: string;
}

const RecipientSelector: React.FC<Props> = ({ onSelect, accountNumber }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [inputAccountNumber, setInputAccountNumber] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(
    null
  );
  const { loading, error } = useSelector((state: RootState) => state.recipient);

  useEffect(() => {
    if (accountNumber) {
      setInputAccountNumber(accountNumber);
      const fetchRecipient = async () => {
        try {
          const recipientData = await dispatch(
            fetchRecipientByAccount(accountNumber)
          ).unwrap();
          if (recipientData) {
            setSelectedRecipient(recipientData);
            onSelect(recipientData);
          }
        } catch (error: any) {
          toast.error(error.message || "Account not found");
          setSelectedRecipient(null);
        }
      };
      fetchRecipient();
    }
  }, [accountNumber, dispatch, onSelect]);

  const handleAccountBlur = async () => {
    if (inputAccountNumber.length >= 10) {
      try {
        const recipientData = await dispatch(
          fetchRecipientByAccount(inputAccountNumber)
        ).unwrap();
        if (recipientData) {
          setSelectedRecipient(recipientData);
          onSelect(recipientData);
        }
      } catch (error: any) {
        toast.error(error.message || "Account not found");
        setSelectedRecipient(null);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block">
          <div className="flex items-center gap-2 mb-2">
            <UserGroupIcon className="h-5 w-5 text-blue-500" />
            <span className="text-gray-700 font-medium">Recipient Account</span>
          </div>
          <div className="relative">
            <input
              type="text"
              value={inputAccountNumber}
              onChange={(e) => setInputAccountNumber(e.target.value)}
              onBlur={handleAccountBlur}
              placeholder="Enter account number"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              minLength={10}
            />
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </label>

        {loading && (
          <div className="flex items-center gap-2 text-gray-500 ml-1">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            <span className="text-sm">Searching account...</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-500 ml-1">
            <XCircleIcon className="h-5 w-5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {selectedRecipient && (
          <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-start gap-3">
              <div className="bg-white p-2 rounded-full">
                <UserIcon className="h-6 w-6 text-blue-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">
                    {selectedRecipient.nickname}
                  </h3>
                  {selectedRecipient.isRecipient && (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  Account: {selectedRecipient.accountNumber}
                </p>
                <span
                  className={`text-xs px-2 py-1 rounded-full mt-1 inline-block
                  ${
                    selectedRecipient.isRecipient
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {selectedRecipient.isRecipient
                    ? "Saved Recipient"
                    : "New Recipient"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipientSelector;
