import React from "react";

interface BankSelectorProps {
  onSelect: (bankId: string) => void;
  defaultBankId?: string;
}

const BankSelector: React.FC<BankSelectorProps> = ({
  onSelect,
  defaultBankId,
}) => {
  const banks = [
    { name: "Group11", code: "group11", bankId: "676fb443732f63c359d59d02" },
    { name: "Group10", code: "CVB", bankId: "676fb538732f63c359d59d03" },
    // Add more banks as needed
  ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBank = banks.find((bank) => bank.bankId === e.target.value);
    if (selectedBank) {
      onSelect(selectedBank.bankId);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-gray-700">Select Recipient Bank</span>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          onChange={handleChange}
          defaultValue={defaultBankId || ""}
        >
          <option value="" disabled>
            Choose a bank
          </option>
          {banks.map((bank) => (
            <option key={bank.bankId} value={bank.bankId}>
              {bank.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default BankSelector;
