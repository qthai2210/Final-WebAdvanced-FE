import React, { useState } from "react";

interface OTPDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (otp: string) => void;
  title: string;
  debtInfo?: {
    content: string;
    createdAt: string;
  } | null;
}

const OTPDialog: React.FC<OTPDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  debtInfo,
}) => {
  const [otp, setOtp] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(otp);
    setOtp("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>

        {/* Add debt information section */}
        {debtInfo && (
          <div className="mb-4 p-4 bg-gray-50 rounded-md">
            <div className="text-sm space-y-2">
              <p>
                <span className="font-medium">Description:</span>{" "}
                {debtInfo.content}
              </p>
              <p>
                <span className="font-medium">Created:</span>{" "}
                {new Date(debtInfo.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full p-2 border rounded mb-4"
            required
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OTPDialog;
