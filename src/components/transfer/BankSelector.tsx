import { BuildingLibraryIcon } from "@heroicons/react/24/outline";
import React from "react";

interface BankSelectorProps {
  onSelect: (bankCode: string) => void;
}

const BankSelector: React.FC<BankSelectorProps> = ({ onSelect }) => {
  const banks = [
    { code: "VCB", name: "Vietcombank", logo: "vietcombank-logo.png" },
    { code: "TCB", name: "Techcombank", logo: "techcombank-logo.png" },
    { code: "ACB", name: "ACB", logo: "acb-logo.png" },
  ];

  return (
    <div className="space-y-2">
      <label className="block">
        <div className="flex items-center gap-2 mb-2">
          <BuildingLibraryIcon className="h-5 w-5 text-gray-600" />
          <span className="text-gray-700 font-medium">
            Select Recipient Bank
          </span>
        </div>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          onChange={(e) => onSelect(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>
            Choose a bank
          </option>
          {banks.map((bank) => (
            <option key={bank.code} value={bank.code} className="py-2">
              {bank.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default BankSelector;
