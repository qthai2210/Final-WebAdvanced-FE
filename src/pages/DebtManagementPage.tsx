import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Tab, Tabs, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchDebts, fetchDebtSummary } from "@/store/debt/debtSlice";
import { DebtSummaryCard } from "../components/DebtSummaryCard";
import { DebtDialog } from "../components/DebtDialog";

export const DebtManagementPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { debts, summary, loading } = useSelector(
    (state: RootState) => state.debt
  );
  const [tabValue, setTabValue] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [dispatch]);

  const loadData = async () => {
    await Promise.all([dispatch(fetchDebts()), dispatch(fetchDebtSummary())]);
  };

  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    loadData(); // Reload data after creating new debt
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Typography variant="h4">Debt Management</Typography>
        <Button variant="contained" color="primary" onClick={handleOpenDialog}>
          Create New Debt
        </Button>
      </Box>

      {summary && (
        <DebtSummaryCard
          totalLent={summary.totalLent}
          totalBorrowed={summary.totalBorrowed}
        />
      )}

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
        >
          <Tab label="Debts You Created" />
          <Tab label="Debts You Received" />
        </Tabs>
      </Box>

      <Box sx={{ mt: 3 }}>
        {tabValue === 0 ? (
          <div>
            {summary?.createdDebts.map((debt) => (
              <div key={debt._id}>{/* Add debt detail component here */}</div>
            ))}
          </div>
        ) : (
          <div>
            {summary?.receivedDebts.map((debt) => (
              <div key={debt._id}>{/* Add debt detail component here */}</div>
            ))}
          </div>
        )}
      </Box>

      <DebtDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSuccess={handleCloseDialog}
      />
    </Container>
  );
};
