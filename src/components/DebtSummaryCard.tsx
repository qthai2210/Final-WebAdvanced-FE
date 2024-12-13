import React from "react";
import { Paper, Typography, Box } from "@mui/material";

interface DebtSummaryCardProps {
  totalLent: number;
  totalBorrowed: number;
}

export const DebtSummaryCard: React.FC<DebtSummaryCardProps> = ({
  totalLent,
  totalBorrowed,
}) => {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Debt Summary
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Box>
          <Typography color="success.main" variant="subtitle1">
            Total Lent
          </Typography>
          <Typography variant="h6">${totalLent.toLocaleString()}</Typography>
        </Box>
        <Box>
          <Typography color="error.main" variant="subtitle1">
            Total Borrowed
          </Typography>
          <Typography variant="h6">
            ${totalBorrowed.toLocaleString()}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};
