import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Typography,
  FormControlLabel,
  Radio,
  RadioGroup,
  Grid,
  InputAdornment,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import api from "../api/api";

const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

const AddLoan = () => {
  const [loanData, setLoanData] = useState({
    clientId: "",
    itemName: "",
    itemNetWeight: 0,
    itemActualValue: 0,
    itemLoanValue: 0,
    itemInterestPercentage: 0,
    itemInterestPeriod: 0,
    returnDate: "",
    repaymentType: "EMI",
    loanStatus: "ACTIVE",
  });

  const [emiDetails, setEmiDetails] = useState({
    emiAmount: 0,
    totalAmount: 0,
    totalInterest: 0,
  });

  const [formErrors, setFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const [clients, setClients] = useState([]);

  useEffect(() => {
    const itemLoanValue = Number(loanData.itemLoanValue);
    const itemInterestPercentage = Number(loanData.itemInterestPercentage);
    const itemInterestPeriod = Number(loanData.itemInterestPeriod);

    if (
      itemLoanValue > 0 &&
      itemInterestPercentage > 0 &&
      itemInterestPeriod > 0
    ) {
      const interestAmount =
        (itemLoanValue * itemInterestPercentage * itemInterestPeriod) / 100;
      const totalAmount = itemLoanValue + interestAmount;

      if (loanData.repaymentType === "EMI_SCHEME") {
        const emiAmount = totalAmount / itemInterestPeriod;
        setEmiDetails({
          emiAmount,
          totalAmount,
          totalInterest: interestAmount,
        });
      } else {
        setEmiDetails({
          emiAmount: 0,
          totalAmount,
          totalInterest: interestAmount,
        });
      }
    }
  }, [loanData]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await api.get("/api/client/getAll");
        setClients(response.data.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    fetchClients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoanData({
      ...loanData,
      [name]: value,
    });
  };

  const handleRepaymentChange = (e) => {
    const { value } = e.target;
    setLoanData({
      ...loanData,
      repaymentType: value,
    });
  };

  const handleDateChange = (e) => {
    const { value } = e.target;
    setLoanData({
      ...loanData,
      returnDate: value,
    });
  };

  const handleClientChange = (e) => {
    const clientId = e.target.value;
    const selectedClient = clients.find(
      (client) => client.clientId === clientId
    );
    if (selectedClient) {
      setLoanData({
        ...loanData,
        clientId: selectedClient.clientId,
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!loanData.clientId) errors.clientId = "Client is required";
    if (!loanData.itemName) errors.itemName = "Item name is required";
    if (!loanData.itemNetWeight || loanData.itemNetWeight <= 0)
      errors.itemNetWeight = "Net weight must be greater than 0";
    if (!loanData.itemActualValue || loanData.itemActualValue <= 0)
      errors.itemActualValue = "Actual value must be greater than 0";
    if (!loanData.itemLoanValue || loanData.itemLoanValue <= 0)
      errors.itemLoanValue = "Loan value must be greater than 0";
    if (
      !loanData.itemInterestPercentage ||
      loanData.itemInterestPercentage <= 0
    )
      errors.itemInterestPercentage = "Interest % must be greater than 0";
    if (!loanData.itemInterestPeriod || loanData.itemInterestPeriod <= 0)
      errors.itemInterestPeriod = "Interest period must be greater than 0";
    if (!loanData.returnDate) errors.returnDate = "Return date is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: "Please fix validation errors.",
        severity: "error",
      });
      return;
    }

    try {
      await api.post("/api/loan/save", loanData);
      setSnackbar({
        open: true,
        message: "Loan added successfully.",
        severity: "success",
      });
      setLoanData({
        clientId: "",
        itemName: "",
        itemNetWeight: 0,
        itemActualValue: 0,
        itemLoanValue: 0,
        itemInterestPercentage: 0,
        itemInterestPeriod: 0,
        returnDate: "",
        repaymentType: "EMI",
        loanStatus: "ACTIVE",
      });
      setEmiDetails({
        emiAmount: 0,
        totalAmount: 0,
        totalInterest: 0,
      });
      setFormErrors({});
    } catch (err) {
      console.error("Error adding loan:", err);
      setSnackbar({
        open: true,
        message: "Failed to add loan.",
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
      {/* <Typography variant="h5" mb={3}>
        Add New Loan
      </Typography> */}
      <Grid container direction="column" spacing={3}>
        <Grid item xs={12}>
          <FormControl
            fullWidth
            variant="outlined"
            error={!!formErrors.clientId}
          >
            <InputLabel>Client</InputLabel>
            <Select
              label="Client"
              value={loanData.clientId}
              onChange={handleClientChange}
              required
            >
              {clients.map((client) => (
                <MenuItem key={client.clientId} value={client.clientId}>
                  {client.clientName} (ID: {client.clientId})
                </MenuItem>
              ))}
            </Select>
            {formErrors.clientId && (
              <Typography variant="caption" color="error">
                {formErrors.clientId}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Item Name"
            variant="outlined"
            fullWidth
            value={loanData.itemName}
            onChange={handleChange}
            name="itemName"
            required
            error={!!formErrors.itemName}
            helperText={formErrors.itemName}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Net Weight"
            variant="outlined"
            fullWidth
            type="number"
            value={loanData.itemNetWeight}
            onChange={handleChange}
            name="itemNetWeight"
            InputProps={{
              endAdornment: <InputAdornment position="end">g</InputAdornment>,
            }}
            error={!!formErrors.itemNetWeight}
            helperText={formErrors.itemNetWeight}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Actual Value"
            variant="outlined"
            fullWidth
            type="number"
            value={loanData.itemActualValue}
            onChange={handleChange}
            name="itemActualValue"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₹</InputAdornment>
              ),
            }}
            required
            error={!!formErrors.itemActualValue}
            helperText={formErrors.itemActualValue}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Loan Value"
            variant="outlined"
            fullWidth
            type="number"
            value={loanData.itemLoanValue}
            onChange={handleChange}
            name="itemLoanValue"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₹</InputAdornment>
              ),
            }}
            required
            error={!!formErrors.itemLoanValue}
            helperText={formErrors.itemLoanValue}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Interest Percentage"
            variant="outlined"
            fullWidth
            type="number"
            value={loanData.itemInterestPercentage}
            onChange={handleChange}
            name="itemInterestPercentage"
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            required
            error={!!formErrors.itemInterestPercentage}
            helperText={formErrors.itemInterestPercentage}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Interest Period (Months)"
            variant="outlined"
            fullWidth
            type="number"
            value={loanData.itemInterestPeriod}
            onChange={handleChange}
            name="itemInterestPeriod"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">months</InputAdornment>
              ),
            }}
            required
            error={!!formErrors.itemInterestPeriod}
            helperText={formErrors.itemInterestPeriod}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl component="fieldset">
            <Typography variant="h6">Repayment Method</Typography>
            <RadioGroup
              name="repaymentType"
              value={loanData.repaymentType}
              onChange={handleRepaymentChange}
            >
              <FormControlLabel
                value="EMI_SCHEME"
                control={<Radio />}
                label="EMI"
              />
              <FormControlLabel
                value="BULLET_PAYMENT"
                control={<Radio />}
                label="Bullet Payment"
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Loan Status</InputLabel>
            <Select
              label="Loan Status"
              value={loanData.loanStatus}
              onChange={handleChange}
              name="loanStatus"
              required
            >
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
              <MenuItem value="DEFAULTED">Defaulted</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Expected Return Date"
            variant="outlined"
            type="date"
            fullWidth
            value={loanData.returnDate}
            onChange={handleDateChange}
            name="returnDate"
            required
            InputLabelProps={{ shrink: true }}
            error={!!formErrors.returnDate}
            helperText={formErrors.returnDate}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ borderTop: "1px solid #ddd", paddingTop: "15px" }}>
            <Typography variant="h6">Loan Preview</Typography>
            <Typography>
              <strong>Interest Amount: </strong>₹{" "}
              {emiDetails.totalInterest
                ? emiDetails.totalInterest.toFixed(2)
                : "0"}
            </Typography>
            <Typography>
              <strong>Total Loan Amount: </strong>₹{" "}
              {emiDetails.totalAmount ? emiDetails.totalAmount.toFixed(2) : "0"}
            </Typography>
            {loanData.repaymentType === "EMI_SCHEME" && (
              <Typography>
                <strong>EMI Amount: </strong>₹{" "}
                {emiDetails.emiAmount ? emiDetails.emiAmount.toFixed(2) : "0"}{" "}
                per month
              </Typography>
            )}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
          >
            Save Loan
          </Button>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default AddLoan;
