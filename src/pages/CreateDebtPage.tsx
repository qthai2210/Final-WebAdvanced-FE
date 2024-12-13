import React from "react";
import { Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CreateDebtForm } from "@/components/CreateDebtForm";

const CreateDebtPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/debts"); // Navigate to debts list after successful creation
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Create New Debt Reminder
      </Typography>
      <CreateDebtForm onSuccess={handleSuccess} />
    </Container>
  );
};

export default CreateDebtPage;
