import React, { useState } from "react";

interface TransferDetailsProps {
  onChange: (data: { amount: number; content: string }) => void;
}

const TransferDetails: React.FC<TransferDetailsProps> = ({ onChange }) => {
  const [amount, setAmount] = useState<string>("");
  const [content, setContent] = useState("");

  const handleAmountChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setAmount(numericValue);
    onChange({
      amount: Number(numericValue),
      content,
    });
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    onChange({
      amount: Number(amount),
      content: value,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Amount</label>
        <div className="relative">
          <span className="absolute left-3 top-2">$</span>
          <input
            type="text"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            className="w-full p-2 pl-8 border rounded"
            placeholder="0.00"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Content</label>
        <textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          className="w-full p-2 border rounded min-h-[100px]"
          placeholder="Enter transfer content..."
        />
      </div>
    </div>
  );
};

export default TransferDetails;
