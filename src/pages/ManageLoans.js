import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Snackbar,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Chip,
  Paper,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { DataGrid } from "@mui/x-data-grid";
import api from "../api/api";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { format } from "date-fns";
import LoanViewModal from "../components/LoanViewModal";
import LoanPayDialog from "../components/LoanPayDialog";
import PaidIcon from "@mui/icons-material/Paid";
import LoanEditModal from "../components/LoanEditModal";
import jsPDF from "jspdf";
import "jspdf-autotable";
import DownloadIcon from "@mui/icons-material/Download";

const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

const statusColorMap = {
  ACTIVE: "success",
  CLOSED: "default",
  DEFAULTED: "error",
  COMPLETED: "info",
};

const ManageLoans = () => {
  const [openPayDialog, setOpenPayDialog] = useState(false);
  const [loanToPay, setLoanToPay] = useState(null);
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [currentLoan, setCurrentLoan] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [loanToDelete, setLoanToDelete] = useState(null);

  useEffect(() => {
    loadLoans();
  }, []);

  const loadLoans = async () => {
    try {
      const { data } = await api.get("/api/loan/getAll");
      setLoans(data.data);
      setFilteredLoans(data.data);
    } catch (err) {
      console.error("Error loading loans:", err);
      setSnackbar({
        open: true,
        message: "Failed to fetch loans.",
        severity: "error",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await api.post(`/api/loan/${loanToDelete.loanId}/delete`);
      setLoans(loans.filter((loan) => loan.loanId !== loanToDelete.loanId));
      setSnackbar({
        open: true,
        message: "Loan deleted successfully.",
        severity: "success",
      });
      setOpenDeleteDialog(false);
      setLoanToDelete(null);
    } catch (err) {
      console.error("Delete failed:", err);
      setSnackbar({
        open: true,
        message: "Failed to delete loan.",
        severity: "error",
      });
    }
  };

  const handleEdit = (loanId) => {
    const loan = loans.find((loan) => loan.loanId === loanId);
    setCurrentLoan(loan);
    setOpenEditModal(true);
  };

  const handleView = (loanId) => {
    const loan = loans.find((loan) => loan.loanId === loanId);
    setCurrentLoan(loan);
    setOpenViewModal(true);
  };

  const generateLoanPdf = (loan) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // ---------- HEADER ----------
    doc.setFontSize(16);
    doc.text("BankerSync - Loan Receipt", 105, 15, { align: "center" });
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
      ["Client ID", loan.clientId || "N/A"],
      ["Name", loan.clientName || "N/A"],
      ["Primary Contact", loan.clientContactPrimary || "N/A"],
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

    // ---------- LOAN INFO ----------
    doc.setFontSize(12);
    const loanInfoY = doc.lastAutoTable.finalY + 10;
    doc.text("Loan Information", clientX, loanInfoY);

    const loanInfo = [
      ["Loan ID", loan.loanId || "N/A"],
      ["Loan Value", `Rs. ${loan.itemLoanValue || "N/A"}`],
      ["Pending Amount", `Rs. ${loan.loanPendingTotalAmount || "N/A"}`],
      ["Status", loan.loanStatus || "N/A"],
      [
        "Issued At",
        loan.issuedAt ? format(new Date(loan.issuedAt), "dd-MM-yyyy") : "N/A",
      ],
      [
        "Return Date",
        loan.returnDate
          ? format(new Date(loan.returnDate), "dd-MM-yyyy")
          : "N/A",
      ],
      [
        "Duration",
        loan.itemInterestPeriod ? `${loan.itemInterestPeriod} months` : "N/A",
      ],
      [
        "Interest Rate",
        loan.itemInterestPercentage ? `${loan.itemInterestPercentage}%` : "N/A",
      ],
      ["Item Name", loan.itemName || "N/A"],
    ];

    doc.autoTable({
      startY: loanInfoY + 4,
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

    doc.save(`loan_${loan.loanId}_details.pdf`);
  };

  const columns = [
    { field: "loanId", headerName: "Loan ID", width: 130 },
    { field: "clientName", headerName: "Client Name", flex: 1 },
    { field: "clientContactPrimary", headerName: "Contact", width: 140 },
    { field: "itemName", headerName: "Item", flex: 1 },
    {
      field: "itemLoanValue",
      headerName: "Loan Value",
      width: 130,
      renderCell: (params) => `₹ ${params?.value}`,
    },
    {
      field: "loanPendingTotalAmount",
      headerName: "Pending Amount",
      width: 160,
      renderCell: (params) => `₹ ${params?.value}`,
    },
    {
      field: "loanStatus",
      headerName: "Status",
      width: 140,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={statusColorMap[params.value] || "default"}
          variant="outlined"
        />
      ),
    },
    {
      field: "issuedAt",
      headerName: "Issued At",
      width: 140,
      renderCell: (params) =>
        params.value ? format(new Date(params.value), "dd-MM-yyyy") : "-",
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
            onClick={() => handleEdit(params.row.loanId)}
          />
          <DeleteIcon
            color="error"
            sx={{ cursor: "pointer" }}
            onClick={() => {
              setLoanToDelete(params.row);
              setOpenDeleteDialog(true);
            }}
          />
          <VisibilityIcon
            color="info"
            sx={{ cursor: "pointer" }}
            onClick={() => handleView(params.row.loanId)}
          />
          <PaidIcon
            color="success"
            sx={{ cursor: "pointer" }}
            onClick={() => {
              setLoanToPay(params.row);
              setOpenPayDialog(true);
            }}
          />
          <DownloadIcon
            color="action"
            sx={{ cursor: "pointer", color: "#007bff" }}
            onClick={() => generateLoanPdf(params.row)}
          />
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ padding: "24px", maxWidth: "1300px", margin: "auto" }}>
      {/* <Typography variant="h5" mb={3}>
        Manage Loans
      </Typography> */}

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 2,
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search by Client Name"
          onChange={(e) => {
            const val = e.target.value.toLowerCase();
            setFilteredLoans(
              loans.filter((loan) =>
                loan.clientName.toLowerCase().includes(val)
              )
            );
          }}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            minWidth: "200px",
          }}
        />

        <select
          onChange={(e) => {
            const status = e.target.value;
            setFilteredLoans(
              status === ""
                ? loans
                : loans.filter((loan) => loan.loanStatus === status)
            );
          }}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            minWidth: "160px",
          }}
          defaultValue=""
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="CLOSED">Closed</option>
          <option value="DEFAULTED">Defaulted</option>
          <option value="COMPLETED">Completed</option>
        </select>

        <input
          type="number"
          placeholder="Min Loan Amount"
          onChange={(e) => {
            const min = parseFloat(e.target.value || 0);
            setFilteredLoans(loans.filter((loan) => loan.itemLoanValue >= min));
          }}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            minWidth: "150px",
          }}
        />

        <input
          type="number"
          placeholder="Min Pending Amount"
          onChange={(e) => {
            const min = parseFloat(e.target.value || 0);
            setFilteredLoans(
              loans.filter((loan) => loan.loanPendingTotalAmount >= min)
            );
          }}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            minWidth: "170px",
          }}
        />

        <Button
          variant="outlined"
          color="secondary"
          onClick={() => setFilteredLoans(loans)}
        >
          Reset Filters
        </Button>
      </Box>

      <Paper
        elevation={3}
        sx={{
          width: "100%",
          height: "calc(100vh - 420px)",
          borderRadius: 5,
          overflow: "hidden",
        }}
      >
        <DataGrid
          rows={filteredLoans}
          columns={columns}
          getRowId={(row) => row.loanId}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5, page: 0 },
            },
          }}
          pageSizeOptions={[5, 10, 15]}
          checkboxSelection={false}
          disableRowSelectionOnClick
          sx={{
            border: 0,
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f5f5f5",
              fontWeight: "bold",
            },
            "& .MuiTablePagination-root": {
              alignItems: "center !important", // Force vertical alignment
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

      <LoanViewModal
        open={openViewModal}
        loan={currentLoan}
        onClose={() => setOpenViewModal(false)}
      />
      <LoanEditModal
        open={openEditModal}
        loan={currentLoan}
        onClose={() => setOpenEditModal(false)}
        onSuccess={loadLoans}
        setSnackbar={setSnackbar}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>

      <LoanPayDialog
        loan={loanToPay}
        open={openPayDialog}
        onClose={() => setOpenPayDialog(false)}
        onSuccess={loadLoans}
        setSnackbar={setSnackbar}
      />

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this loan?
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

export default ManageLoans;
