import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { AppDispatch, RootState } from "@/store/store";
import {
  confirmTransfer,
  initiateExternalTransfer,
} from "@/store/transaction/transactionSlice";
import { TransactionFormData } from "@/types/transaction.types";
import { toast } from "react-toastify";
import SourceAccountSelector from "../components/transfer/SourceAccountSelector";
import BankSelector from "../components/transfer/BankSelector"; // You'll need to create this component
import TransferDetails from "../components/transfer/TransferDetails";
import FeePaymentMethod from "../components/transfer/FeePaymentMethod";
import OTPConfirmation from "../components/transfer/OTPConfirmation";
import { setNavigationPath } from "@/store/auth/authSlice";

const ExternalTransferPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentTransfer, loading } = useSelector(
    (state: RootState) => state.transaction
  );
  const [formData, setFormData] = useState<TransactionFormData>({
    toAccount: "",
    bankId: "676fb538732f63c359d59d03", // New field for bank selection
    amount: 0,
    content: "",
    feeType: "sender",
  });
  const [showOTP, setShowOTP] = useState(false);
  const [searchParams] = useSearchParams();
  const [transactionId, setTransactionId] = useState<string>("");

  useEffect(() => {
    const accountFromUrl = searchParams.get("accountNumber");
    if (accountFromUrl) {
      setFormData((prev) => ({ ...prev, toAccount: accountFromUrl }));
    }
  }, [searchParams]);

  const handleTransfer = async () => {
    try {
      if (!isFormValid()) {
        toast.error("Please fill in all required fields");
        return;
      }

      const result = await dispatch(
        initiateExternalTransfer({
          ...formData,
        })
      ).unwrap();

      if (result?.transactionId) {
        // Thay đổi từ result?._id thành result?.transactionId
        setTransactionId(result.transactionId);
        setShowOTP(true);
      } else {
        toast.error("Failed to create transfer");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to initiate transfer");
    }
  };

  const handleOTPConfirm = async (otp: string) => {
    try {
      if (!transactionId) {
        toast.error("No transaction ID found");
        return;
      }

      await dispatch(
        confirmTransfer({
          transactionId: transactionId,
          otp,
          type: "external",
        })
      ).unwrap();

      toast.success("Transfer completed successfully");
      setShowOTP(false);
      dispatch(setNavigationPath("/dashboard"));
    } catch (error: any) {
      toast.error(error.message || "Failed to confirm transfer");
    }
  };

  const isFormValid = () => {
    return (
      formData.toAccount &&
      formData.amount > 0 &&
      formData.content &&
      formData.bankId
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Interbank Transfer</h1>

      <SourceAccountSelector
        onSelect={(account) =>
          setFormData((prev) => ({ ...prev, fromAccount: account }))
        }
      />

      <BankSelector
        onSelect={(bankCode) => setFormData((prev) => ({ ...prev, bankCode }))}
      />

      <div className="space-y-4">
        <label className="block">
          <span className="text-gray-700">Recipient Account Number</span>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={formData.toAccount}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, toAccount: e.target.value }))
            }
            placeholder="Enter account number"
          />
        </label>
      </div>

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
    </div>
  );
};

export default ExternalTransferPage;
