import React from "react";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";

const ClientEditModal = ({
  open,
  clientData,
  onSave,
  onClose,
  setEditClientData,
}) => {
  if (!clientData) return null;

  const handleInputChange = (e) => {
    setEditClientData({ ...clientData, [e.target.name]: e.target.value });
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="client-edit-modal">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          padding: 3,
          borderRadius: 2,
          width: 600,
          margin: "auto",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Edit Client Details
        </Typography>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          name="clientName"
          value={clientData.clientName}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Father's Name"
          variant="outlined"
          fullWidth
          name="clientFatherName"
          value={clientData.clientFatherName}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Address"
          variant="outlined"
          fullWidth
          name="clientAddress"
          value={clientData.clientAddress}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Primary Contact"
          variant="outlined"
          fullWidth
          name="clientContactPrimary"
          value={clientData.clientContactPrimary}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Secondary Contact"
          variant="outlined"
          fullWidth
          name="clientContactSecondary"
          value={clientData.clientContactSecondary}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />
        <Box mt={2}>
          <Button variant="contained" onClick={onSave}>
            Save
          </Button>
          <Button variant="contained" onClick={onClose} sx={{ ml: 2 }}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ClientEditModal;
