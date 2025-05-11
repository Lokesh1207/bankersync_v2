import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import PaidIcon from "@mui/icons-material/Paid";
import api from "../api/api";

const LoanPayDialog = ({ loan, open, onClose, onSuccess, setSnackbar }) => {
  const [amountPaid, setAmountPaid] = useState("");
  const [previewPending, setPreviewPending] = useState(null);

  useEffect(() => {
    if (!loan) return;
    setAmountPaid("");
    setPreviewPending(loan.loanPendingTotalAmount);
  }, [loan]);

  const handleAmountChange = (e) => {
    const value = parseFloat(e.target.value);
    setAmountPaid(e.target.value);
    if (!isNaN(value)) {
      const updated = loan.loanPendingTotalAmount - value;
      setPreviewPending(updated < 0 ? 0 : updated);
    } else {
      setPreviewPending(loan.loanPendingTotalAmount);
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await api.post(`/api/loan/${loan.loanId}/pay`, null, {
        params: { amountPaid },
      });
      setSnackbar({
        open: true,
        message: "Loan payment recorded successfully.",
        severity: "success",
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Payment failed:", err);
      setSnackbar({
        open: true,
        message: "Failed to record payment.",
        severity: "error",
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <PaidIcon sx={{ mr: 1, verticalAlign: "middle" }} />
        Record Loan Payment
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1" gutterBottom>
          <strong>Name:</strong> {loan?.clientName}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>Pending Amount:</strong> ₹{loan?.loanPendingTotalAmount}
        </Typography>

        <TextField
          fullWidth
          type="number"
          label="Amount Paid"
          value={amountPaid}
          onChange={handleAmountChange}
          margin="normal"
          InputProps={{ inputProps: { min: 0 } }}
        />

        {amountPaid && (
          <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
            <strong>New Pending Amount:</strong> ₹{previewPending}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={!amountPaid}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoanPayDialog;
