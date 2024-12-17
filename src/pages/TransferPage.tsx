import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  initiateTransfer,
  confirmTransfer,
} from "@/store/transaction/transactionSlice";
import { TransactionFormData } from "@/types/transaction.types";
import SourceAccountSelector from "../components/SourceAccountSelector";
import RecipientInfo from "../components/RecipientInfo";
import TransferDetails from "../components/TransferDetails";
import FeePaymentMethod from "../components/FeePaymentMethod";
import OTPConfirmation from "../components/OTPConfirmation";

const TransferPage = () => {
  const dispatch = useDispatch();
  const { currentTransfer, loading } = useSelector(
    (state: RootState) => state.transaction
  );
  const [formData, setFormData] = useState<TransactionFormData>({
    toAccount: "",
    amount: 0,
    content: "",
    feeType: "sender",
  });

  const handleTransfer = async () => {
    //await dispatch(initiateTransfer(formData));
  };

  return (
    <div>
      <h1>Transfer Funds</h1>
      <SourceAccountSelector />
      <RecipientInfo
        onRecipientSelect={(account) =>
          setFormData({ ...formData, toAccount: account })
        }
      />
      <TransferDetails
        onChange={(data) => setFormData({ ...formData, ...data })}
      />
      <FeePaymentMethod
        onChange={(feeType) => setFormData({ ...formData, feeType })}
      />
      <button onClick={handleTransfer} disabled={loading}>
        {loading ? "Processing..." : "Transfer"}
      </button>
      {currentTransfer && (
        <OTPConfirmation transactionId={currentTransfer.id} />
      )}
    </div>
  );
};

export default TransferPage;
