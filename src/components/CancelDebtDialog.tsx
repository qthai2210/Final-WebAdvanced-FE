import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FiAlertTriangle } from "react-icons/fi";

interface CancelDebtDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export function CancelDebtDialog({
  open,
  onClose,
  onConfirm,
}: CancelDebtDialogProps) {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason);
      setReason("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white/80 backdrop-blur-md border border-red-100/50 shadow-xl">
        <DialogHeader className="space-y-4">
          <div className="mx-auto w-12 h-12 bg-red-50/60 backdrop-blur-sm rounded-full flex items-center justify-center">
            <FiAlertTriangle className="w-6 h-6 text-red-600/90" />
          </div>
          <DialogTitle className="text-center text-xl font-semibold text-gray-900">
            Cancel Debt Request
          </DialogTitle>
          <p className="text-center text-sm text-gray-500">
            Please provide a reason for cancelling this debt. This action cannot
            be undone.
          </p>
        </DialogHeader>
        <div className="space-y-4 py-4 bg-white/50 rounded-md">
          <div className="space-y-2">
            <Label
              htmlFor="reason"
              className="text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              Cancellation Reason
              <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a detailed reason for cancelling this debt..."
              className="min-h-[120px] resize-none bg-white/70 backdrop-blur-sm 
                border-gray-200/50 focus:border-red-300/50 
                focus:ring focus:ring-red-200/30 
                transition-all duration-200"
            />
            <p className="text-xs text-gray-500 mt-1">
              The other party will be notified of this cancellation and the
              reason provided.
            </p>
          </div>
        </div>
        <DialogFooter className="sm:justify-center gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto bg-white/70 hover:bg-gray-50/70 
              backdrop-blur-sm border-gray-200/50 
              transition-all duration-200"
          >
            Keep Debt
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!reason.trim()}
            className={`w-full sm:w-auto transition-all duration-200 
              ${
                !reason.trim()
                  ? "opacity-50 cursor-not-allowed"
                  : "bg-red-600/80 hover:bg-red-700/80 backdrop-blur-sm"
              }`}
          >
            Confirm Cancellation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
