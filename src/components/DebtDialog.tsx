import React from "react";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import { X } from "lucide-react";
import { CreateDebtForm } from "./CreateDebtForm";

interface DebtDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const DebtDialog: React.FC<DebtDialogProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const handleSuccess = () => {
    onSuccess?.();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Create New Debt Reminder
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <X size={20} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <CreateDebtForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
};
