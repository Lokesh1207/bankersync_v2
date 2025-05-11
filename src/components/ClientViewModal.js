import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Avatar,
  Button,
  DialogActions,
} from "@mui/material";
import { format } from "date-fns";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";


const renderFormattedDate = (dateValue) => {
  const date = new Date(dateValue);
  return isNaN(date.getTime()) ? "" : format(date, "dd-MM-yyyy");
};

const ClientViewModal = ({ open, onClose, client }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [proofOpen, setProofOpen] = useState(false);

  const handleTabChange = (_, newIndex) => setTabIndex(newIndex);

  const renderStatusChip = (status) => (
    <Chip
      label={status}
      color={status === "ACTIVE" ? "success" : "default"}
      variant="outlined"
      size="small"
    />
  );

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Client - {client?.clientName}
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Tabs value={tabIndex} onChange={handleTabChange}>
            <Tab label="Client Details" />
            <Tab label="Loans" />
            <Tab label="EMI Schedule" />
          </Tabs>

          <Box sx={{ mt: 2 }}>
            {tabIndex === 0 && (
              <Box display="flex" gap={3}>
                <Avatar
                  src={client?.clientPictureURL}
                  sx={{ width: 100, height: 100 }}
                />
                <Box flex={1}>
                  <Typography variant="h6">{client?.clientName}</Typography>
                  <Typography>📞 {client?.clientContactPrimary}</Typography>
                  <Typography>📍 {client?.clientAddress}</Typography>
                  <Typography>👤 Username: {client?.clientUsername}</Typography>
                  <Typography>
                    <strong>Father's Name:</strong> {client?.clientFatherName}
                  </Typography>
                  <Typography>
                    <strong>Secondary Contact:</strong>{" "}
                    {client?.clientContactSecondary}
                  </Typography>
                  <Typography>
                    <strong>Created At:</strong>{" "}
                    {renderFormattedDate(client?.clientCreatedAt)}
                  </Typography>
                  <Typography>
                    <strong>Updated At:</strong>{" "}
                    {renderFormattedDate(client?.clientUpdatedAt)}
                  </Typography>

                  {client?.clientProofURL && (
                    <Box mt={2}>
                      <Button
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                        onClick={() => setProofOpen(true)}
                      >
                        View Proof
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>
            )}

            {tabIndex === 1 && (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Item Name</TableCell>
                    <TableCell>Loan Value</TableCell>
                    <TableCell>Interest %</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Issued On</TableCell>
                    <TableCell>Return Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {client?.loans?.map((loan) => (
                    <TableRow key={loan.loanId}>
                      <TableCell>{loan.itemName}</TableCell>
                      <TableCell>₹{loan.itemLoanValue}</TableCell>
                      <TableCell>{loan.itemInterestPercentage}%</TableCell>
                      <TableCell>{renderStatusChip(loan.loanStatus)}</TableCell>
                      <TableCell>
                        {renderFormattedDate(loan.issuedAt)}
                      </TableCell>
                      <TableCell>
                        {loan.returnDate
                          ? renderFormattedDate(loan.returnDate)
                          : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {tabIndex === 2 && (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Month</TableCell>
                    <TableCell>EMI Label</TableCell> {/* Added this line */}
                    <TableCell>Due Date</TableCell>
                    <TableCell>Principal</TableCell>
                    <TableCell>Interest</TableCell>
                    <TableCell>Total EMI</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Paid Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(client?.emis || []).map((emi, idx) => (
                    <TableRow key={emi.emiId || idx}>
                      <TableCell>{emi.monthNumber}</TableCell>
                      <TableCell>{emi.emiLabel}</TableCell>
                      <TableCell>{renderFormattedDate(emi.dueDate)}</TableCell>
                      <TableCell>₹{emi.principalComponent}</TableCell>
                      <TableCell>₹{emi.interestComponent}</TableCell>
                      <TableCell>₹{emi.totalEMI}</TableCell>
                      <TableCell>
                        <Chip
                          label={emi.isPaid ? "PAID" : "UNPAID"}
                          color={emi.isPaid ? "success" : "warning"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {emi.isPaid ? renderFormattedDate(emi.paidDate) : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Box>
        </DialogContent>
      </Dialog>

      {/* Proof Image Dialog */}
      <Dialog
        open={proofOpen}
        onClose={() => setProofOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>ID Proof</DialogTitle>
        <DialogContent>
          <Box display="flex" justifyContent="center">
            <img
              src={client?.clientProofURL}
              alt="Proof"
              style={{
                maxWidth: "100%",
                maxHeight: 400,
                borderRadius: 8,
                border: "1px solid #ccc",
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProofOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ClientViewModal;
