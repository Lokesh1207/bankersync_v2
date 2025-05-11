import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import MuiAlert from "@mui/material/Alert";
import api from "../api/api";
import { format } from "date-fns";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ClientEditModal from "../components/ClientEditModal";
import ClientViewModal from "../components/ClientViewModal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import DownloadIcon from "@mui/icons-material/Download";

const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

const ManageClients = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [search, setSearch] = useState("");
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);
  const [editClientData, setEditClientData] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    filterClients(search);
  }, [search, clients]);

  const loadClients = async () => {
    try {
      const { data } = await api.get("/api/client/getAll");
      setClients(data.data);
      setFilteredClients(data.data);
    } catch (err) {
      console.error("Error loading clients:", err);
      setSnackbar({
        open: true,
        message: "Failed to fetch clients.",
        severity: "error",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await api.post(`/api/client/delete/${clientToDelete.clientId}`);
      setClients((prev) =>
        prev.filter((c) => c.clientId !== clientToDelete.clientId)
      );
      setSnackbar({
        open: true,
        message: "Client deleted successfully.",
        severity: "success",
      });
      setOpenDeleteDialog(false); // Close the dialog after deletion
      setClientToDelete(null); // Clear client to delete
    } catch (err) {
      console.error("Delete failed:", err);
      setSnackbar({
        open: true,
        message: "Failed to delete client.",
        severity: "error",
      });
    }
  };

  const handleEdit = (id) => {
    const client = clients.find((client) => client.clientId === id);
    setCurrentClient(client);
    setEditClientData({ ...client });
    setOpenEditModal(true);
  };

  const handleView = async (id) => {
    try {
      const { data } = await api.get(`/api/client/getByIdWithLoansEmis/${id}`);
      setCurrentClient(data.data); // Set the fetched client data
      setOpenViewModal(true); // Open the view modal
    } catch (err) {
      console.error("Failed to fetch client details:", err);
      setSnackbar({
        open: true,
        message: "Failed to load client details.",
        severity: "error",
      });
    }
  };

  const handleCloseViewModal = () => {
    setOpenViewModal(false);
    setCurrentClient(null);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setEditClientData(null);
  };

  const handleSaveEdit = async () => {
    // Optimistic UI update: update the client locally first
    const updatedClient = { ...editClientData };

    // Update the clients state immediately
    setClients((prev) =>
      prev.map((client) =>
        client.clientId === updatedClient.clientId ? updatedClient : client
      )
    );

    try {
      // Save the changes to the backend
      const response = await api.post(
        `/api/client/edit/${currentClient.clientId}`,
        editClientData
      );
      // If the update is successful, you can handle success here
      setSnackbar({
        open: true,
        message: "Client updated successfully.",
        severity: "success",
      });
      handleCloseEditModal();
    } catch (err) {
      console.error("Update failed:", err);
      setSnackbar({
        open: true,
        message: "Failed to update client.",
        severity: "error",
      });

      // Revert the optimistic UI update in case of error
      setClients((prev) =>
        prev.map((client) =>
          client.clientId === currentClient.clientId ? currentClient : client
        )
      );
    }
  };

  const filterClients = (search) => {
    if (!search) {
      setFilteredClients(clients);
    } else {
      const lowercasedSearch = search.toLowerCase();
      const filteredData = clients.filter((client) =>
        Object.values(client).some(
          (val) =>
            val && val.toString().toLowerCase().includes(lowercasedSearch)
        )
      );
      setFilteredClients(filteredData);
    }
  };

  const generateClientPDF = async (clientId) => {
    try {
      // Make an API call using the custom axios instance
      const response = await api.get(
        `/api/client/getByIdWithLoansEmis/${clientId}`
      ); 
      const client = response.data.data; 
      if (!client) return;

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // ---------- HEADER ----------
      doc.setFontSize(16);
      doc.text("BankerSync - Client Report", 105, 15, { align: "center" });
      doc.setFontSize(10);
      doc.text(
        `Generated on: ${format(new Date(), "dd-MM-yyyy HH:mm")}`,
        105,
        22,
        { align: "center" }
      );

      // ---------- CLIENT SECTION ----------
      const startY = 30;
      const clientX = 15;

      doc.setFontSize(12);
      doc.text("Client Details", clientX, startY);

      const clientDetails = [
        ["Client ID", client.clientId || "N/A"],
        ["Name", client.clientName || "N/A"],
        ["Username", client.clientUsername || "N/A"],
        ["Father's Name", client.clientFatherName || "N/A"],
        ["Primary Contact", client.clientContactPrimary || "N/A"],
        ["Secondary Contact", client.clientContactSecondary || "N/A"],
        ["Address", client.clientAddress || "N/A"],
      ];

      doc.autoTable({
        startY: startY + 4,
        body: clientDetails,
        theme: "grid",
        styles: { fontSize: 9 },
        columnStyles: {
          0: { fontStyle: "bold", cellWidth: 45 },
          1: { cellWidth: 140 },
        },
        margin: { left: clientX },
        tableLineColor: [220, 220, 220],
        tableLineWidth: 0.2,
      });

      // ---------- CLIENT PICTURE ----------
      if (client.clientPictureURL) {
        const imageX = 155; // X position of the image
        const imageY = 35; // Y position of the image
        const imageSize = 40; // Width and height (square)

        // Add the image in a square shape (passport photo style)
        doc.addImage(
          client.clientPictureURL,
          "JPEG",
          imageX,
          imageY,
          imageSize,
          imageSize
        );
      }

      // ---------- LOANS SECTION ----------
      if (client.loans && client.loans.length > 0) {
        const loansY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(12);
        doc.text("Loans", clientX, loansY);

        client.loans.forEach((loan, index) => {
          const loanInfo = [
            ["Loan Item", loan.itemName || "N/A"],
            ["Loan Amount", `Rs. ${loan.itemLoanValue || "N/A"}`],
            ["Loan Status", loan.loanStatus || "N/A"],
            [
              "Issued At",
              loan.issuedAt
                ? format(new Date(loan.issuedAt), "dd-MM-yyyy")
                : "N/A",
            ],
            [
              "Return Date",
              loan.returnDate
                ? format(new Date(loan.returnDate), "dd-MM-yyyy")
                : "N/A",
            ],
            [
              "Duration",
              loan.itemInterestPeriod
                ? `${loan.itemInterestPeriod} months`
                : "N/A",
            ],
            [
              "Interest Rate",
              loan.itemInterestPercentage
                ? `${loan.itemInterestPercentage}%`
                : "N/A",
            ],
          ];

          doc.autoTable({
            startY: loansY + 4 + index * 60,
            body: loanInfo,
            theme: "grid",
            styles: { fontSize: 9 },
            columnStyles: {
              0: { fontStyle: "bold", cellWidth: 45 },
              1: { cellWidth: 140 },
            },
            margin: { left: clientX },
            tableLineColor: [220, 220, 220],
            tableLineWidth: 0.2,
          });

          // ---------- EMI Schedule ----------
          if (loan.emiSchedule && loan.emiSchedule.length > 0) {
            const emiY = doc.lastAutoTable.finalY + 10;
            doc.setFontSize(12);
            doc.text("EMI Schedule", clientX, emiY);

            const emiRows = loan.emiSchedule.map((emi, index) => {
              let dateFormatted = "Invalid Date";
              try {
                const parsed = new Date(emi.dueDate);
                if (!isNaN(parsed)) {
                  dateFormatted = format(parsed, "dd-MM-yyyy");
                }
              } catch (e) {
                dateFormatted = "N/A";
              }

              return [
                index + 1,
                dateFormatted,
                `Rs. ${emi.totalEMI || 0}`,
                emi.isPaid ? "Paid" : "Unpaid",
              ];
            });

            doc.autoTable({
              startY: emiY + 4,
              head: [["S.No", "Due Date", "Total EMI", "Status"]],
              body: emiRows,
              theme: "grid",
              styles: { fontSize: 8 },
              columnStyles: {
                0: { cellWidth: 10 },
                1: { cellWidth: 40 },
                2: { cellWidth: 40 },
                3: { cellWidth: 40 },
              },
              margin: { left: clientX },
              tableLineColor: [220, 220, 220],
              tableLineWidth: 0.2,
            });
          }
        });
      }

      // Finalizing the PDF and saving it
      doc.save(`Client_${client.clientId}_Report.pdf`);
    } catch (error) {
      console.error("Error generating client PDF:", error);
    }
  };

  const columns = [
    { field: "clientId", headerName: "ID", width: 90 },
    { field: "clientName", headerName: "Name", flex: 1 },
    { field: "clientFatherName", headerName: "Father's Name", flex: 1 },
    {
      field: "clientContactPrimary",
      headerName: "Primary Contact",
      width: 150,
    },
    {
      field: "clientCreatedAt",
      headerName: "Created At",
      width: 150,
      renderCell: (params) => format(new Date(params.value), "dd-MM-yyyy"),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <EditIcon
            color="primary"
            sx={{ cursor: "pointer" }}
            onClick={() => handleEdit(params.row.clientId)}
          />
          <DeleteIcon
            color="error"
            sx={{ cursor: "pointer" }}
            onClick={() => {
              setClientToDelete(params.row);
              setOpenDeleteDialog(true);
            }}
          />
          <VisibilityIcon
            color="info"
            sx={{ cursor: "pointer" }}
            onClick={() => handleView(params.row.clientId)}
          />
          <DownloadIcon
            color="action"
            sx={{ cursor: "pointer", color: "#007bff" }}
            onClick={() => generateClientPDF(params.row.clientId)}
          />
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ padding: "24px", maxWidth: "1300px", margin: "auto" }}>
      <TextField
        variant="outlined"
        label="Search clients"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{
          mb: 3,
          width: "400px", // reduced width
          bgcolor: "#fff",
          borderRadius: 1,
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#d0d7de",
            },
            "&:hover fieldset": {
              borderColor: "#1976d2",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#1976d2",
            },
          },
        }}
      />
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          height: "calc(100vh - 420px)", // adjust as needed
          borderRadius: 5,
          overflow: "hidden",
        }}
      >
        <DataGrid
          rows={filteredClients}
          columns={columns}
          getRowId={(row) => row.clientId}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5, page: 0 },
            },
          }}
          pageSizeOptions={[5, 10, 15, 20]}
          checkboxSelection={false}
          disableRowSelectionOnClick
          sx={{
            border: 0,
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f5f5f5",
              fontWeight: "bold",
            },
            "& .MuiTablePagination-root": {
              alignItems: "center !important",
              display: "flex",
            },
            "& .MuiTablePagination-toolbar": {
              minHeight: "48px !important",
              height: "48px",
            },
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
              {
                marginTop: "0 !important",
                marginBottom: "0 !important",
                lineHeight: "1.5rem",
              },
            "& .MuiTablePagination-actions": {
              marginBottom: "0 !important",
            },
          }}
        />
      </Paper>

      <ClientViewModal
        open={openViewModal}
        client={currentClient}
        onClose={handleCloseViewModal}
      />
      <ClientEditModal
        open={openEditModal}
        clientData={editClientData}
        onSave={handleSaveEdit}
        onClose={handleCloseEditModal}
        setEditClientData={setEditClientData}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>

      {/* Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="delete-client-dialog"
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this client?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageClients;
