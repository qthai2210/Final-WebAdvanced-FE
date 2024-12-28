import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FiMail, FiShield } from "react-icons/fi";

interface PaymentOtpDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (otp: string) => void;
  onResendOtp: () => void;
  isVerifying?: boolean;
}

export function PaymentOtpDialog({
  open,
  onClose,
  onConfirm,
  onResendOtp,
  isVerifying = false,
}: PaymentOtpDialogProps) {
  const [otp, setOtp] = useState("");

  const handleConfirm = () => {
    if (otp.trim()) {
      onConfirm(otp);
      setOtp("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] bg-gradient-to-b from-white/95 to-white/90 backdrop-blur-md shadow-xl border border-blue-100/50">
        <DialogHeader className="space-y-3">
          <div className="mx-auto w-16 h-16 bg-blue-50/80 backdrop-blur-sm rounded-2xl flex items-center justify-center transform rotate-45">
            <div className="transform -rotate-45">
              <FiShield className="w-8 h-8 text-blue-600/90" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
            Payment Verification
          </DialogTitle>
          <p className="text-center text-sm text-gray-500 px-4">
            Enter the OTP code sent to your email to complete the payment
          </p>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-4">
            <div className="relative">
              <Input
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="······"
                maxLength={6}
                className="text-center text-3xl py-6 bg-white/70 
                  backdrop-blur-sm border-gray-200/50 focus:border-blue-300/50
                  rounded-xl shadow-inner transition-all duration-200
                  focus:ring-2 focus:ring-blue-200/50 font-medium
                  [letter-spacing:2rem] pl-[2rem]
                  placeholder:text-gray-300 placeholder:[letter-spacing:1rem] placeholder:pl-0"
              />
              <div className="absolute inset-x-0 -bottom-2 h-4 bg-gradient-to-t from-white/50 to-transparent" />
            </div>

            <div className="text-center space-y-2">
              <Button
                variant="link"
                onClick={onResendOtp}
                className="text-sm text-blue-600/90 hover:text-blue-800/90 transition-colors
                  flex items-center gap-2 mx-auto group"
              >
                <FiMail className="transition-transform group-hover:scale-110" />
                Resend OTP
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-center gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-white/70 hover:bg-gray-50/70 border-gray-200/50
              transition-all duration-200 px-8 rounded-lg
              hover:border-gray-300/50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={otp.length !== 6 || isVerifying}
            className={`px-8 rounded-lg transition-all duration-300 
              ${
                otp.length === 6 && !isVerifying
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  : "bg-gray-400/50 cursor-not-allowed"
              } text-white backdrop-blur-sm shadow-lg hover:shadow-xl
              disabled:shadow-none`}
          >
            {isVerifying ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                Verifying...
              </div>
            ) : (
              "Verify & Pay"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
