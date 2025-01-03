import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface UnlockOTPDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (otp: string) => void;
}

const UnlockOTPDialog: React.FC<UnlockOTPDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [otp, setOtp] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl transform transition-all">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Verify Unlock Code</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <p className="text-gray-600 mb-4">
          Please enter the verification code sent to your email to unlock your
          account.
        </p>

        <input
          type="text"
          className="w-full px-4 py-2 text-center text-2xl tracking-widest border rounded-lg mb-4 focus:border-blue-500 focus:ring-blue-500"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          placeholder="Enter OTP"
        />

        <div className="flex gap-3">
          <button
            onClick={() => onConfirm(otp)}
            className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Verify
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnlockOTPDialog;
