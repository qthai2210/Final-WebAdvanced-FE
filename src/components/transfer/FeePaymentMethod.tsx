import React from "react";

interface FeePaymentMethodProps {
  onChange: (feeType: "sender" | "receiver") => void;
}

const FeePaymentMethod: React.FC<FeePaymentMethodProps> = ({ onChange }) => {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold mb-4">Fee Payment Method</h3>
      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="feeType"
            value="sender"
            onChange={() => onChange("sender")}
            defaultChecked
            className="form-radio"
          />
          <span>I will pay the transfer fee</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="feeType"
            value="receiver"
            onChange={() => onChange("receiver")}
            className="form-radio"
          />
          <span>Recipient will pay the transfer fee</span>
        </label>
      </div>
    </div>
  );
};

export default FeePaymentMethod;
