import React from "react";

interface BankSelectorProps {
  onSelect: (bankCode: string) => void;
}

const BankSelector: React.FC<BankSelectorProps> = ({ onSelect }) => {
  const banks = [
    { code: "VCB", name: "Vietcombank" },
    { code: "TCB", name: "Techcombank" },
    { code: "ACB", name: "ACB" },
    // Add more banks as needed
  ];

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-gray-700">Select Recipient Bank</span>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          onChange={(e) => onSelect(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>
            Choose a bank
          </option>
          {banks.map((bank) => (
            <option key={bank.code} value={bank.code}>
              {bank.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default BankSelector;
