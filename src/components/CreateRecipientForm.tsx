import React, { useState } from "react";
import { Button, TextField, Box } from "@mui/material";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { createRecipient } from "@/store/recipient/recipientSlice";

interface CreateRecipientFormProps {
  onSuccess?: () => void;
}

export const CreateRecipientForm: React.FC<CreateRecipientFormProps> = ({
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    accountNumber: "",
    nickname: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(
        createRecipient({
          ...formData,
        })
      ).unwrap();
      setFormData({ accountNumber: "", nickname: "" });
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.message);
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
        inputProps={{ maxLength: 10 }}
        placeholder="Account Number must be exactly 10 digits"
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Nickname"
        name="nickname"
        value={formData.nickname}
        onChange={handleChange}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
      >
        Create Recipient
      </Button>
    </Box>
  );
};
