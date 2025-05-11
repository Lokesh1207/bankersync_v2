import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DownloadIcon from "@mui/icons-material/Download";
import PaidIcon from "@mui/icons-material/Paid";
import api from "../api/api";
import { motion } from "framer-motion";
import { generateLoanReceiptPdf } from "../utils/pdfUtils";

const statusColor = {
  ONGOING: "warning",
  COMPLETED: "success",
  DEFAULT: "default",
};

const User = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLoans = async () => {
    try {
      const response = await api.get("/api/user/loans");
      setLoans(response.data.data);
    } catch (error) {
      console.error("Error fetching loans", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayEmi = async (emiId) => {
    try {
      await api.post(`/api/user/emis/${emiId}/pay`);
      fetchLoans(); // refresh
    } catch (error) {
      alert("Failed to pay EMI.");
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
        <Typography mt={2}>Loading your loans...</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3} fontWeight="bold" color="maroon">
        My Loans & EMI Tracker
      </Typography>
      {loans.map((loan) => (
        <motion.div
          key={loan.loanId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Accordion sx={{ mb: 2, borderRadius: 2, boxShadow: 3 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <Typography fontWeight="bold">{loan.itemName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {loan.clientName} ({loan.clientContactPrimary})
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography>
                    Total Pending: ₹{loan.loanPendingTotalAmount.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Chip
                    label={loan.loanStatus}
                    color={statusColor[loan.loanStatus] || statusColor.DEFAULT}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={3} textAlign="right">
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={() => generateLoanReceiptPdf(loan)}
                  >
                    Download Report
                  </Button>
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Divider sx={{ mb: 2 }} />
              <Typography fontWeight="bold" mb={1}>
                EMI Schedule
              </Typography>
              {loan.emiSchedule.map((emi) => (
                <Box
                  key={emi.emiId}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p={1}
                  bgcolor={emi.isPaid ? "#e8f5e9" : "#fff3e0"}
                  borderRadius={1}
                  mb={1}
                >
                  <Box>
                    <Typography variant="body1">
                      {emi.emiLabel} — Due:{" "}
                      {new Date(emi.dueDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Principal: ₹{emi.principalComponent} | Interest: ₹
                      {emi.interestComponent} | Total: ₹{emi.totalEMI}
                    </Typography>
                  </Box>
                  <Box>
                    {emi.isPaid ? (
                      <Chip
                        label="Paid"
                        color="success"
                        size="small"
                        icon={<PaidIcon />}
                      />
                    ) : (
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        startIcon={<PaidIcon />}
                        onClick={() => handlePayEmi(emi.emiId)}
                      >
                        Pay EMI
                      </Button>
                    )}
                  </Box>
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        </motion.div>
      ))}
    </Box>
  );
};

export default User;
