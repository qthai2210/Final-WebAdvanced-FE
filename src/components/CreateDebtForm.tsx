import React, { useState } from "react";
import { Button, TextField, Paper, Typography, Box } from "@mui/material";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { createDebt } from "@/store/debt/debtSlice";

interface CreateDebtFormProps {
  onSuccess?: () => void;
}

export const CreateDebtForm: React.FC<CreateDebtFormProps> = ({
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    accountNumber: "",
    amount: "",
    content: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(
        createDebt({
          ...formData,
          amount: Number(formData.amount),
        })
      ).unwrap();
      setFormData({ accountNumber: "", amount: "", content: "" });
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
        label="Account Number"
        name="accountNumber"
        value={formData.accountNumber}
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
