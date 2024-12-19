import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  forgotPassword,
  verifyOTPForgotPassword,
} from "@/store/auth/authSlice";
import { AppDispatch, RootState } from "@/store/store";
import React from "react";
import { useNavigate } from "react-router-dom";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { forgotPasswordLoading, verifyOTPLoading } = useSelector(
    (state: RootState) => state.auth
  );

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(forgotPassword(email)).unwrap();
      setShowOtpInput(true);
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(verifyOTPForgotPassword({ email, otp })).unwrap();
      // Store email for reset password page
      localStorage.setItem("resetEmail", email);
      navigate("/reset-password", { replace: true });
    } catch (error) {
      console.error("Failed to verify OTP:", error);
    }
  };

  return (
    <div className="space-y-6">
      {!showOtpInput ? (
        <form onSubmit={handleSubmitEmail} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>
          <button
            type="submit"
            disabled={forgotPasswordLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            {forgotPasswordLoading ? "Sending..." : "Send Reset Instructions"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700"
            >
              Enter OTP
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>
          <button
            type="submit"
            disabled={verifyOTPLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            {verifyOTPLoading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordForm;
