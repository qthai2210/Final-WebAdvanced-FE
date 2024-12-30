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
import { UserGroupIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

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
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-8">
        <UserGroupIcon className="h-8 w-8 text-green-500" />
        <h1 className="text-2xl font-bold text-gray-800">Internal Transfer</h1>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <SourceAccountSelector
            onSelect={(account) =>
              setFormData((prev) => ({ ...prev, fromAccount: account }))
            }
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
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
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <TransferDetails
            onChange={(details) =>
              setFormData((prev) => ({ ...prev, ...details }))
            }
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <FeePaymentMethod
            onChange={(feeType) =>
              setFormData((prev) => ({ ...prev, feeType }))
            }
          />
        </div>

        <button
          onClick={handleTransfer}
          disabled={loading || !isFormValid()}
          className="w-full py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <ArrowPathIcon className="h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            "Transfer"
          )}
        </button>
      </div>

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
