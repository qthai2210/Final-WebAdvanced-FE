import React, { useState } from "react";
import { Button, TextField, Paper, Typography, Box } from "@mui/material";
import { toast } from "react-toastify";
import { debtService } from "../services/debt.service";

interface CreateDebtFormProps {
  onSuccess?: () => void;
}

export const CreateDebtForm: React.FC<CreateDebtFormProps> = ({
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    toUserId: "",
    amount: "",
    content: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await debtService.createDebt({
        ...formData,
        amount: Number(formData.amount),
      });
      toast.success("Debt reminder created successfully");
      setFormData({ toUserId: "", amount: "", content: "" });
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to create debt reminder");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        fullWidth
        margin="normal"
        label="User ID"
        name="toUserId"
        value={formData.toUserId}
        onChange={handleChange}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Amount"
        name="amount"
        type="number"
        value={formData.amount}
        onChange={handleChange}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Content"
        name="content"
        value={formData.content}
        onChange={handleChange}
        multiline
        rows={3}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
      >
        Create Debt Reminder
      </Button>
    </Box>
  );
};
