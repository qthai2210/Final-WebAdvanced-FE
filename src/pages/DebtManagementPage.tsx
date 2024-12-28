import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Tab,
  Tabs,
  Button,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  fetchDebts,
  fetchCreatedDebts,
  fetchDebtSummary,
  cancelDebt,
  sendPaymentOtp,
  payDebt,
} from "@/store/debt/debtSlice";
import { DebtSummaryCard } from "../components/DebtSummaryCard";
import { DebtDialog } from "../components/DebtDialog";
import { DebtDetailCard } from "@/components/DebtDetailCard";
import { toast } from "react-toastify";
import { CancelDebtDialog } from "@/components/CancelDebtDialog";
import { PaymentOtpDialog } from "@/components/PaymentOtpDialog";

export const DebtManagementPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { debts, createdDebts, summary, loading } = useSelector(
    (state: RootState) => {
      console.log("Current state:", state.debt); // Add this for debugging
      return state.debt;
    }
  );
  const [tabValue, setTabValue] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDebtId, setSelectedDebtId] = useState<string | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedPaymentDebtId, setSelectedPaymentDebtId] = useState<
    string | null
  >(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    loadData();
  }, [dispatch]);

  const loadData = async () => {
    await Promise.all([
      dispatch(fetchDebts()),
      dispatch(fetchCreatedDebts()),
      dispatch(fetchDebtSummary()),
    ]);
    console.log("Debts", debts);
  };

  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    loadData(); // Reload data after creating new debt
  };

  const handleCancelDebt = (debtId: string) => {
    setSelectedDebtId(debtId);
    setIsCancelDialogOpen(true);
  };

  const handleConfirmCancel = async (reason: string) => {
    if (!selectedDebtId) return;

    try {
      await dispatch(
        cancelDebt({
          debtId: selectedDebtId,
          cancelReason: reason,
        })
      );
      loadData();
    } catch (error) {
      console.error("Error cancelling debt:", error);
    }
    setSelectedDebtId(null);
  };

  const handlePayDebt = async (debtId: string) => {
    setSelectedPaymentDebtId(debtId);
    try {
      await dispatch(sendPaymentOtp({ debtId }));
      setIsPaymentDialogOpen(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP");
    }
  };

  const handleResendOtp = async () => {
    if (!selectedPaymentDebtId) return;
    try {
      await dispatch(sendPaymentOtp({ debtId: selectedPaymentDebtId }));
      toast.success("OTP resent successfully");
    } catch (error) {
      toast.error("Failed to resend OTP");
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    if (!selectedPaymentDebtId) return;

    setIsVerifying(true);
    try {
      await dispatch(
        payDebt({
          debtId: selectedPaymentDebtId,
          otp,
        })
      );
      setIsPaymentDialogOpen(false);
      loadData();
    } catch (error) {
      console.error("Error paying debt:", error);
    } finally {
      setIsVerifying(false);
      setSelectedPaymentDebtId(null);
    }
  };

  useEffect(() => {
    console.log("Debts updated:", { debts, createdDebts, summary });
  }, [debts, createdDebts, summary]); // This will run whenever these values change

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     loadData();
  //   }, 30000); // Refresh every 30 seconds

  //   return () => clearInterval(interval); // Cleanup on unmount
  // }, []);

  const sortDebtsByStatus = (debts: any[]) => {
    return [...debts].sort((a, b) => {
      // Define status priority (pending first)
      const statusPriority: { [key: string]: number } = {
        pending: 0,
        paid: 1,
        cancelled: 2,
      };

      // Sort by status first
      const statusComparison =
        statusPriority[a.status.toLowerCase()] -
        statusPriority[b.status.toLowerCase()];
      if (statusComparison !== 0) return statusComparison;

      // If status is same, sort by date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  };

  if (loading) {
    return (
      <div>
        <CircularProgress /> Loading...
      </div>
    );
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
            {sortDebtsByStatus(createdDebts || []).map((debt) => (
              <DebtDetailCard
                key={debt._id}
                debt={debt}
                onCancel={handleCancelDebt}
                isCreated={true}
              />
            ))}
          </div>
        ) : (
          <div>
            {sortDebtsByStatus(debts || []).map((debt) => (
              <DebtDetailCard
                key={debt._id}
                debt={debt}
                onPay={handlePayDebt}
                onCancel={handleCancelDebt}
                isCreated={false}
              />
            ))}
          </div>
        )}
      </Box>

      <DebtDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSuccess={handleCloseDialog}
      />

      <CancelDebtDialog
        open={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        onConfirm={handleConfirmCancel}
      />

      <PaymentOtpDialog
        open={isPaymentDialogOpen}
        onClose={() => setIsPaymentDialogOpen(false)}
        onConfirm={handleVerifyOtp}
        onResendOtp={handleResendOtp}
        isVerifying={isVerifying}
      />
    </Container>
  );
};
