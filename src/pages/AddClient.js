import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Snackbar,
  Alert,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import api from "../api/api";

const AddClient = () => {
  const initialClientData = {
    clientName: "",
    clientFatherName: "",
    clientUsername: "",
    clientAddress: "",
    clientContactPrimary: "",
    clientContactSecondary: "",
    proof: null,
    picture: null,
  };

  const [clientData, setClientData] = useState(initialClientData);
  const [alert, setAlert] = useState({
    visible: false,
    message: "",
    color: "info",
  });

  useEffect(() => {
    if (alert.visible) {
      const timer = setTimeout(() => {
        setAlert((prev) => ({ ...prev, visible: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert.visible]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData({ ...clientData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setClientData({ ...clientData, [name]: files[0] });
  };

  const validateInputs = () => {
    const {
      clientName,
      clientFatherName,
      clientUsername,
      clientContactPrimary,
      clientContactSecondary,
    } = clientData;

    if (!clientName || !clientFatherName || !clientUsername) {
      return "Please fill all required fields.";
    }

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(clientUsername)) {
      return "Username must be a valid Gmail address.";
    }

    if (clientContactPrimary && !/^\d{10}$/.test(clientContactPrimary)) {
      return "Primary Contact must be 10 digits.";
    }

    if (clientContactSecondary && !/^\d{10}$/.test(clientContactSecondary)) {
      return "Secondary Contact must be 10 digits.";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateInputs();
    if (validationError) {
      setAlert({ visible: true, message: validationError, color: "error" });
      return;
    }

    try {
      const formData = new FormData();
      const clientDetails = {
        clientName: clientData.clientName,
        clientFatherName: clientData.clientFatherName,
        clientUsername: clientData.clientUsername,
        clientAddress: clientData.clientAddress,
        clientContactPrimary: clientData.clientContactPrimary,
        clientContactSecondary: clientData.clientContactSecondary,
      };

      formData.append("clientDetails", JSON.stringify(clientDetails));
      if (clientData.proof) formData.append("proof", clientData.proof);
      if (clientData.picture) formData.append("picture", clientData.picture);

      await api.post("/api/client/save", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAlert({
        visible: true,
        message: "Client saved successfully!",
        color: "success",
      });
      setClientData(initialClientData);
    } catch (error) {
      console.error(error);
      setAlert({
        visible: true,
        message: "Failed to save client. Try again.",
        color: "error",
      });
    }
  };

  return (
    <Box sx={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
      {/* <Typography variant="h5" color="error" textAlign="center" mb={3}>
        Add New Client
      </Typography> */}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3} direction="column">
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Client Name"
              name="clientName"
              value={clientData.clientName}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Father's Name"
              name="clientFatherName"
              value={clientData.clientFatherName}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Username (Gmail only)"
              name="clientUsername"
              type="email"
              value={clientData.clientUsername}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="clientAddress"
              value={clientData.clientAddress}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Primary Contact"
              name="clientContactPrimary"
              type="tel"
              value={clientData.clientContactPrimary}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Secondary Contact"
              name="clientContactSecondary"
              type="tel"
              value={clientData.clientContactSecondary}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <InputLabel sx={{ mb: 1 }}>Upload Proof</InputLabel>
            <Button
              variant="outlined"
              component="label"
              sx={{ textTransform: "none", borderRadius: 2, width: "50%" }}
            >
              {clientData.proof ? clientData.proof.name : "Choose File"}
              <input
                hidden
                accept=".png,.jpg,.jpeg,.pdf"
                type="file"
                name="proof"
                onChange={handleFileChange}
              />
            </Button>
          </Grid>

          <Grid item xs={12}>
            <InputLabel sx={{ mb: 1 }}>Upload Picture</InputLabel>
            <Button
              variant="outlined"
              component="label"
              sx={{ textTransform: "none", borderRadius: 2, width: "50%" }}
            >
              {clientData.picture ? clientData.picture.name : "Choose File"}
              <input
                hidden
                accept=".png,.jpg,.jpeg"
                type="file"
                name="picture"
                onChange={handleFileChange}
              />
            </Button>
          </Grid>

          <Grid item xs={12} textAlign="center">
            <Button
              variant="contained"
              color="error"
              type="submit"
              size="large"
              sx={{
                px: 5,
                py: 1.5,
                borderRadius: "25px",
                width: "100%",
                maxWidth: 300,
              }}
            >
              Save Client
            </Button>
          </Grid>
        </Grid>
      </form>

      <Snackbar
        open={alert.visible}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, visible: false })}
      >
        <Alert severity={alert.color} sx={{ width: "100%" }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddClient;
