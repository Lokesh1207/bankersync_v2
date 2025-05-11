import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  MenuItem,
  Alert,
} from "@mui/material";
import api from "../api/api";

const LoanEditModal = ({ open, loan, onClose, onSuccess, setSnackbar }) => {
  const [editLoan, setEditLoan] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [emi, setEmi] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (loan) {
      setEditLoan({
        itemName: loan.itemName || "",
        itemNetWeight: loan.itemNetWeight || "",
        itemActualValue: loan.itemActualValue || "",
        itemLoanValue: loan.itemLoanValue || "",
        itemInterestPercentage: loan.itemInterestPercentage || "",
        itemInterestPeriod: loan.itemInterestPeriod || "",
        returnDate: loan.returnDate || "",
        repaymentType: loan.repaymentType || "MONTHLY",
        loanStatus: loan.loanStatus || "ACTIVE",
      });

      setIsDisabled(
        loan.loanStatus === "COMPLETED" ||
        loan.loanStatus === "CLOSED" ||
        loan.repaymentType?.toUpperCase().trim() === "EMI_SCHEME"
      );
    }
  }, [loan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditLoan({ ...editLoan, [name]: value });

    if (
      name === "itemLoanValue" ||
      name === "itemInterestPercentage" ||
      name === "itemInterestPeriod"
    ) {
      recalculateLoan(value, name);
    }
  };

  const recalculateLoan = (value, name) => {
    const { itemLoanValue, itemInterestPercentage, itemInterestPeriod } =
      editLoan;

    let principal = parseFloat(itemLoanValue) || 0;
    let interestRate = parseFloat(itemInterestPercentage) || 0;
    let months = parseInt(itemInterestPeriod) || 0;

    if (name === "itemLoanValue") principal = parseFloat(value) || 0;
    if (name === "itemInterestPercentage")
      interestRate = parseFloat(value) || 0;
    if (name === "itemInterestPeriod") months = parseInt(value) || 0;

    const totalInterest = (principal * interestRate * months) / 100;
    const totalAmount = principal + totalInterest;
    const emi = totalAmount / months;

    setTotalInterest(totalInterest);
    setTotalAmount(totalAmount);
    setEmi(emi);
  };

  const handleSubmit = async () => {
    if (isDisabled) return; // 🚫 Prevent editing for disabled state

    try {
      await api.post(`/api/loan/${loan.loanId}/edit`, {
        clientId: loan.clientId,
        ...editLoan,
      });

      setSnackbar({
        open: true,
        message: "Loan updated successfully.",
        severity: "success",
      });
      onClose();
      onSuccess();
    } catch (err) {
      console.error("Update failed", err);
      setSnackbar({
        open: true,
        message: "Failed to update loan.",
        severity: "error",
      });
    }
  };

  if (!editLoan) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          width: "90%",
          maxWidth: 600,
          maxHeight: "90vh",
          overflowY: "auto",
          p: 3,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Edit Loan Details
        </Typography>

        {isDisabled && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {loan.repaymentType === "EMI_SCHEME"
              ? "EMI has already been scheduled and this loan cannot be edited."
              : "This loan is completed or closed and cannot be edited."}
          </Alert>
        )}

        <TextField
          label="Item Name"
          name="itemName"
          fullWidth
          value={editLoan.itemName}
          onChange={handleChange}
          sx={{ mb: 2 }}
          disabled={isDisabled}
        />

        <TextField
          label="Net Weight (gms)"
          name="itemNetWeight"
          type="number"
          fullWidth
          value={editLoan.itemNetWeight}
          onChange={handleChange}
          sx={{ mb: 2 }}
          disabled={isDisabled}
        />

        <TextField
          label="Actual Value (₹)"
          name="itemActualValue"
          type="number"
          fullWidth
          value={editLoan.itemActualValue}
          onChange={handleChange}
          sx={{ mb: 2 }}
          disabled={isDisabled}
        />

        <TextField
          label="Loan Value (₹)"
          name="itemLoanValue"
          type="number"
          fullWidth
          value={editLoan.itemLoanValue}
          onChange={handleChange}
          sx={{ mb: 2 }}
          disabled={isDisabled}
        />

        <TextField
          label="Interest %"
          name="itemInterestPercentage"
          type="number"
          fullWidth
          value={editLoan.itemInterestPercentage}
          onChange={handleChange}
          sx={{ mb: 2 }}
          disabled={isDisabled}
        />

        <TextField
          label="Interest Period (months)"
          name="itemInterestPeriod"
          type="number"
          fullWidth
          value={editLoan.itemInterestPeriod}
          onChange={handleChange}
          sx={{ mb: 2 }}
          disabled={isDisabled}
        />

        <TextField
          label="Return Date"
          name="returnDate"
          type="date"
          fullWidth
          value={editLoan.returnDate}
          onChange={(e) =>
            setEditLoan({ ...editLoan, returnDate: e.target.value })
          }
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
          disabled={isDisabled}
        />

        <TextField
          label="Loan Status"
          name="loanStatus"
          select
          fullWidth
          value={editLoan.loanStatus}
          onChange={handleChange}
          sx={{ mb: 3 }}
          disabled={isDisabled}
        >
          <MenuItem value="ACTIVE">Active</MenuItem>
          <MenuItem value="COMPLETED">Completed</MenuItem>
          <MenuItem value="DEFAULTED">Defaulted</MenuItem>
          <MenuItem value="CLOSED">Closed</MenuItem>
        </TextField>

        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>Live Preview:</strong>
        </Typography>
        <Typography variant="body2">
          <strong>Total Interest: </strong> ₹{totalInterest.toFixed(2)}
        </Typography>
        <Typography variant="body2">
          <strong>Total Amount: </strong> ₹{totalAmount.toFixed(2)}
        </Typography>
        {editLoan.itemInterestPeriod && (
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>EMI: </strong> ₹{emi.toFixed(2)}
          </Typography>
        )}

        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isDisabled}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default LoanEditModal;
