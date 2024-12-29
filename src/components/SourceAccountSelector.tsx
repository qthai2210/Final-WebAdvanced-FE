import React from "react";

const SourceAccountSelector = () => {
  // Mock data for source accounts
  const accounts = [
    { id: 1, name: "Checking Account", balance: 1000 },
    { id: 2, name: "Savings Account", balance: 5000 },
  ];

  return (
    <div>
      <label htmlFor="sourceAccount">Select Source Account:</label>
      <select id="sourceAccount">
        {accounts.map((account) => (
          <option key={account.id} value={account.id}>
            {account.name} - ${new Intl.NumberFormat().format(account.balance)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SourceAccountSelector;
