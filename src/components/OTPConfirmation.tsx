// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { confirmTransfer } from "@/store/transaction/transactionSlice";
// import { AppDispatch } from "@/store/store";

// interface Props {
//   transactionId: string;
// }

// const OTPConfirmation: React.FC<Props> = ({ transactionId }) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const [otp, setOtp] = useState("");

//   const handleConfirm = () => {
//     dispatch(confirmTransfer({ transactionId, otp }));
//   };

//   return (
//     <div>
//       <label htmlFor="otp">Enter OTP:</label>
//       <input
//         id="otp"
//         type="text"
//         value={otp}
//         onChange={(e) => setOtp(e.target.value)}
//       />
//       <button onClick={handleConfirm}>Confirm</button>
//     </div>
//   );
// };

// export default OTPConfirmation;
