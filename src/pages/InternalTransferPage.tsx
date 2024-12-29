import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { AppDispatch, RootState } from "@/store/store";
import {
  initiateTransfer,
  confirmTransfer,
} from "@/store/transaction/transactionSlice";
import { TransactionFormData } from "@/types/transaction.types";
import { toast } from "react-toastify";
import SourceAccountSelector from "../components/transfer/SourceAccountSelector";
import RecipientSelector from "../components/transfer/RecipientSelector";
import TransferDetails from "../components/transfer/TransferDetails";
import FeePaymentMethod from "../components/transfer/FeePaymentMethod";
import OTPConfirmation from "../components/transfer/OTPConfirmation";
import SaveRecipientPrompt from "../components/transfer/SaveRecipientPrompt";
import { setNavigationPath } from "@/store/auth/authSlice";

const InternalTransferPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentTransfer, loading } = useSelector(
    (state: RootState) => state.transaction
  );
  const [formData, setFormData] = useState<TransactionFormData>({
    toAccount: "",
    amount: 0,
    content: "",
    feeType: "sender",
  });
  const [showOTP, setShowOTP] = useState(false);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [searchParams] = useSearchParams();
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [isExistingRecipient, setIsExistingRecipient] = useState(false);

  useEffect(() => {
    const accountFromUrl = searchParams.get("accountNumber");
    if (accountFromUrl) {
      setAccountNumber(accountFromUrl);
      setFormData((prev) => ({ ...prev, toAccount: accountFromUrl }));
    }
  }, [searchParams]);

  const handleTransfer = async () => {
    try {
      if (!isFormValid()) {
        toast.error("Please fill in all required fields");
        return;
      }

      const result = await dispatch(initiateTransfer(formData)).unwrap();
      if (result) {
        setShowOTP(true);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to initiate transfer");
    }
  };

  const handleOTPConfirm = async (otp: string) => {
    try {
      console.log("currentTransfer", currentTransfer);
      if (!currentTransfer?._id) {
        console.log("No active transfer found");
        toast.error("No active transfer found");
        return;
      }

      await dispatch(
        confirmTransfer({
          transactionId: currentTransfer._id.toString(),
          otp,
          type: "internal",
        })
      ).unwrap();

      toast.success("Transfer completed successfully");
      setShowOTP(false);

      if (isExistingRecipient) {
        dispatch(setNavigationPath("/dashboard"));
      } else {
        setShowSavePrompt(true);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to confirm transfer");
    }
  };

  const isFormValid = () => {
    return formData.toAccount && formData.amount > 0 && formData.content;
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Transfer Money</h1>

      <SourceAccountSelector
        onSelect={(account) =>
          setFormData((prev) => ({ ...prev, fromAccount: account }))
        }
      />

      <RecipientSelector
        accountNumber={accountNumber}
        onSelect={(recipient) => {
          setFormData((prev) => ({
            ...prev,
            toAccount: recipient.accountNumber,
          }));
          setIsExistingRecipient(recipient.isRecipient);
        }}
      />

      <TransferDetails
        onChange={(details) => setFormData((prev) => ({ ...prev, ...details }))}
      />

      <FeePaymentMethod
        onChange={(feeType) => setFormData((prev) => ({ ...prev, feeType }))}
      />

      <button
        onClick={handleTransfer}
        disabled={loading || !isFormValid()}
        className="w-full py-2 px-4 bg-blue-500 text-white rounded disabled:bg-gray-300"
      >
        {loading ? "Processing..." : "Transfer"}
      </button>

      {showOTP && (
        <OTPConfirmation
          onConfirm={handleOTPConfirm}
          onCancel={() => setShowOTP(false)}
        />
      )}

      {showSavePrompt && !isExistingRecipient && (
        <SaveRecipientPrompt
          recipient={{
            accountNumber: formData.toAccount,
          }}
          onClose={() => {
            setShowSavePrompt(false);
            dispatch(setNavigationPath("/dashboard"));
          }}
        />
      )}
    </div>
  );
};

export default InternalTransferPage;