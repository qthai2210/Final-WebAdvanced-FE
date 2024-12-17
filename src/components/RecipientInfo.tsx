import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecipientByAccount } from "@/store/recipient/recipientSlice";
import { AppDispatch, RootState } from "@/store/store";

interface Props {
  onRecipientSelect: (accountNumber: string) => void;
}

const RecipientInfo: React.FC<Props> = ({ onRecipientSelect }) => {
  const dispatch: AppDispatch = useDispatch();
  const { savedRecipients, loading } = useSelector(
    (state: RootState) => state.recipient
  );

  const handleAccountNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const accountNumber = e.target.value;
    if (accountNumber.length >= 10) {
      dispatch(fetchRecipientByAccount(accountNumber));
      onRecipientSelect(accountNumber);
    }
  };

  return (
    <div>
      <label htmlFor="recipientAccountNumber">Recipient Account Number:</label>
      <input
        id="recipientAccountNumber"
        type="text"
        onChange={handleAccountNumberChange}
      />
      <label htmlFor="recipientName">Recipient Name:</label>
      <input
        id="recipientName"
        type="text"
        value={savedRecipients[0].nickname || ""}
        readOnly
      />
      {loading && <span>Searching...</span>}
    </div>
  );
};

export default RecipientInfo;
