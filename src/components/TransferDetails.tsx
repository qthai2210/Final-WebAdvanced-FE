import React, { useState } from "react";

const TransferDetails = () => {
  const [amount, setAmount] = useState("");
  const [content, setContent] = useState("");

  return (
    <div>
      <label htmlFor="transferAmount">Amount:</label>
      <input
        id="transferAmount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <label htmlFor="transferContent">Content:</label>
      <input
        id="transferContent"
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </div>
  );
};

export default TransferDetails;
