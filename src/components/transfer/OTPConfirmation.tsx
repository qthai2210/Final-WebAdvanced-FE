import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface OTPConfirmationProps {
  onConfirm: (otp: string) => void;
  onCancel: () => void;
}

const OTPConfirmation: React.FC<OTPConfirmationProps> = ({
  onConfirm,
  onCancel,
}) => {
  const [otp, setOtp] = useState("");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md relative shadow-xl transform transition-all">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Enter OTP Code</h2>
        <p className="text-gray-600 mb-4">
          Please enter the OTP code sent to your phone number
        </p>

        <input
          type="text"
          className="w-full px-4 py-2 text-center text-2xl tracking-widest border rounded-lg mb-4 focus:border-blue-500 focus:ring-blue-500"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          placeholder="000000"
        />

        <div className="flex gap-3">
          <button
            onClick={() => onConfirm(otp)}
            className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPConfirmation;
