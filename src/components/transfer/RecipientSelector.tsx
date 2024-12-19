import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchRecipientByAccount } from "@/store/recipient/recipientSlice";
import { Recipient } from "@/types/recipient.types";
import { toast } from "react-toastify";

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
        <label className="block text-sm font-medium">Recipient Account</label>
        <input
          type="text"
          value={inputAccountNumber}
          onChange={(e) => setInputAccountNumber(e.target.value)}
          onBlur={handleAccountBlur}
          placeholder="Enter account number"
          className="w-full p-2 border rounded"
          minLength={10}
        />
        {loading && <p className="text-gray-500">Searching...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {selectedRecipient && (
          <div className="mt-2 p-3 bg-gray-50 rounded-md">
            <h3 className="font-medium text-gray-700">Account Information</h3>
            <div className="mt-1 text-sm text-gray-600">
              <p>Account Number: {selectedRecipient.accountNumber}</p>
              <p>Type: {selectedRecipient.type}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipientSelector;
