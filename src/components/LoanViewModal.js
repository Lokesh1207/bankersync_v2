import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Box,
  Typography,
  Avatar,
  Chip,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import api from "../api/api";
import { format } from "date-fns";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

const statusColorMap = {
  ACTIVE: "success",
  CLOSED: "default",
  DEFAULTED: "error",
  COMPLETED: "info",
};

const LoanViewModal = ({ open, onClose, loan }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [fullLoan, setFullLoan] = useState(null);
  const [client, setClient] = useState(null);
  const [emiSchedule, setEmiSchedule] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loan && open) {
      fetchLoanDetails(loan.loanId);
    }
  }, [loan, open]);

  const fetchLoanDetails = async (loanId) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/api/loan/${loanId}/getById`);
      setFullLoan(data.data);

      const clientId = data.data.clientId;
      const clientRes = await api.get(`/api/client/getById/${clientId}`);
      setClient(clientRes.data.data);

      const emiRes = await api.get(`/api/emi/${loanId}`);
      setEmiSchedule(emiRes.data.data);
    } catch (err) {
      console.error("Failed to fetch full loan or EMI details:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Loan Details
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {loading || !fullLoan || !client ? (
          <Box textAlign="center" p={4}>
            <CircularProgress />
            <Typography mt={2}>Loading...</Typography>
          </Box>
        ) : (
          <>
            <Tabs value={tabIndex} onChange={(e, val) => setTabIndex(val)}>
              <Tab label="Client Details" />
              <Tab label="Loan Info" />
              {emiSchedule.length > 0 && <Tab label="EMI Schedule" />}
            </Tabs>

            <Box p={2}>
              {tabIndex === 0 && (
                <Box display="flex" gap={3}>
                  <Avatar
                    src={client.clientPictureURL}
                    sx={{ width: 100, height: 100 }}
                  />
                  <Box>
                    <Typography variant="h6">{client.clientName}</Typography>
                    <Typography>📞 {client.clientContactPrimary}</Typography>
                    <Typography>📍 {client.clientAddress}</Typography>
                    <Typography>
                      👤 Username: {client.clientUsername}
                    </Typography>
                  </Box>
                </Box>
              )}

              {tabIndex === 1 && (
                <Box>
                  <Typography variant="h6">{fullLoan.itemName}</Typography>
                  <Typography>Net Weight: {fullLoan.itemNetWeight}g</Typography>
                  <Typography>
                    Actual Value: ₹ {fullLoan.itemActualValue}
                  </Typography>
                  <Typography>
                    Loan Value: ₹ {fullLoan.itemLoanValue}
                  </Typography>
                  <Typography>
                    Interest: {fullLoan.itemInterestPercentage}% for{" "}
                    {fullLoan.itemInterestPeriod} months
                  </Typography>
                  <Typography>
                    Issued At:{" "}
                    {format(new Date(fullLoan.issuedAt), "dd-MM-yyyy")}
                  </Typography>
                  <Typography>
                    Return Date:{" "}
                    {format(new Date(fullLoan.returnDate), "dd-MM-yyyy")}
                  </Typography>

                  <Box mt={2}>
                    <Typography color="error">
                      Pending Principal: ₹{" "}
                      {fullLoan.loanPendingPrincipalAmount?.toFixed(2)}
                    </Typography>
                    <Typography color="warning.main">
                      Pending Interest: ₹{" "}
                      {fullLoan.loanPendingInterestAmount?.toFixed(2)}
                    </Typography>
                    <Typography color="primary">
                      Total Due: ₹ {fullLoan.loanPendingTotalAmount?.toFixed(2)}
                    </Typography>
                  </Box>

                  <Box mt={2}>
                    <Chip
                      label={fullLoan.loanStatus}
                      color={statusColorMap[fullLoan.loanStatus] || "default"}
                      variant="outlined"
                    />
                  </Box>
                </Box>
              )}

              {tabIndex === 2 && emiSchedule.length > 0 && (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>S.No</TableCell>
                      <TableCell>Label</TableCell>
                      <TableCell>Principal</TableCell>
                      <TableCell>Interest</TableCell>
                      <TableCell>Total EMI</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {emiSchedule.map((emi, idx) => (
                      <TableRow key={emi.emiId}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{emi.emiLabel}</TableCell>
                        <TableCell>
                          ₹ {emi.principalComponent.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          ₹ {emi.interestComponent.toFixed(2)}
                        </TableCell>
                        <TableCell>₹ {emi.totalEMI.toFixed(2)}</TableCell>
                        <TableCell>
                          {format(new Date(emi.dueDate), "dd-MM-yyyy")}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={emi.isPaid ? "PAID" : "UNPAID"}
                            size="small"
                            color={emi.isPaid ? "success" : "warning"}
                          />
                        </TableCell>
                        <TableCell>
                          {!emi.isPaid && (
                            <Chip
                              label="Mark as Paid"
                              color="primary"
                              clickable
                              onClick={async () => {
                                try {
                                  const res = await api.post(
                                    `/api/emi/${emi.emiId}/pay`
                                  );
                                  const updatedEmi = res.data.data;
                                  setEmiSchedule((prev) =>
                                    prev.map((e) =>
                                      e.emiId === updatedEmi.emiId
                                        ? updatedEmi
                                        : e
                                    )
                                  );
                                  // Optional: Refresh loan status if COMPLETED
                                  const loanRes = await api.get(
                                    `/api/loan/${loan.loanId}/getById`
                                  );
                                  setFullLoan(loanRes.data.data);
                                } catch (err) {
                                  console.error(
                                    "Failed to mark EMI as paid:",
                                    err
                                  );
                                  alert("Failed to mark EMI as paid");
                                }
                              }}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LoanViewModal;
