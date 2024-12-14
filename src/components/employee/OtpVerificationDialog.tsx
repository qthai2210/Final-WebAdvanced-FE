import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface OtpVerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onVerify: (email: string, otp: string) => Promise<void>;
}

export function OtpVerificationDialog({
  isOpen,
  onClose,
  email,
  onVerify,
}: OtpVerificationDialogProps) {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const { verificationLoading } = useSelector(
    (state: RootState) => state.employee
  );

  const handleVerify = async () => {
    try {
      setIsVerifying(true);
      await onVerify(email, otp);
      setOtp("");
      onClose();
    } catch (error) {
      console.error("OTP verification failed:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold text-center">
            Verify Your Email
          </DialogTitle>
          <div className="h-1 w-16 bg-primary mx-auto rounded-full" />
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              We've sent a verification code to
            </p>
            <p className="text-sm font-medium text-primary">{email}</p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="otp" className="text-center">
              Enter Verification Code
            </Label>
            <Input
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit code"
              className="text-center text-lg tracking-widest"
              maxLength={6}
            />
          </div>
          <Button
            onClick={handleVerify}
            disabled={!otp || isVerifying}
            className="w-full py-6 text-lg font-semibold transition-all duration-200"
          >
            {isVerifying ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
                Verifying...
              </div>
            ) : (
              "Verify OTP"
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Didn't receive the code?{" "}
            <button className="text-primary hover:underline" onClick={onClose}>
              Try again
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
