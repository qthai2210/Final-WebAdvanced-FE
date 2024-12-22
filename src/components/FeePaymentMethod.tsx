import React, { useState } from "react";

const FeePaymentMethod = () => {
  const [feeMethod, setFeeMethod] = useState("sender");

  return (
    <div>
      <label>Fee Payment Method:</label>
      <div>
        <input
          type="radio"
          id="senderPays"
          name="feeMethod"
          value="sender"
          checked={feeMethod === "sender"}
          onChange={() => setFeeMethod("sender")}
        />
        <label htmlFor="senderPays">Sender Pays</label>
      </div>
      <div>
        <input
          type="radio"
          id="recipientPays"
          name="feeMethod"
          value="recipient"
          checked={feeMethod === "recipient"}
          onChange={() => setFeeMethod("recipient")}
        />
        <label htmlFor="recipientPays">Recipient Pays</label>
      </div>
    </div>
  );
};

export default FeePaymentMethod;
