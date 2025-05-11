import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateLoanReceiptPdf = (loan) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.setTextColor("#B22222");
  doc.text("Loan Payment Receipt", 105, 15, { align: "center" });
  doc.setDrawColor(178, 34, 34); // Red color for the line
  doc.setLineWidth(0.5); // Line thickness
  doc.line(14, 20, 195, 20); // x1, y1, x2, y2

  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Receipt Date: ${new Date().toLocaleDateString()}`, 14, 30);

  doc.setFont(undefined, "bold");
  doc.text("Client Details:", 14, 40);
  doc.setFont(undefined, "normal");
  doc.text(`Name: ${loan.clientName ?? "N/A"}`, 14, 48);
  doc.text(`Contact: ${loan.clientContactPrimary ?? "N/A"}`, 14, 56);

  doc.setFont(undefined, "bold");
  doc.text("Loan Details:", 14, 70);
  doc.setFont(undefined, "normal");
  doc.text(`Loan ID: ${loan.loanId ?? "N/A"}`, 14, 78);
  doc.text(`Item Name: ${loan.itemName ?? "N/A"}`, 14, 86);
  doc.text(
    `Loan Amount: Rs.${
      loan.loanPrincipalAmount?.toFixed(2) ?? "0.00"
    } | Interest Rate: ${loan.itemInterestPercentage ?? "N/A"}%`,
    14,
    94
  );
  doc.text(
    `Total Paid: Rs.${
      loan.itemLoanValue - loan.loanPendingTotalAmount?.toFixed(2) ?? "0.00"
    } | Pending: Rs.${loan.loanPendingTotalAmount?.toFixed(2) ?? "0.00"}`,
    14,
    102
  );

  doc.setFont(undefined, "bold");
  doc.text("EMI Schedule:", 14, 115);

  const emiRows = (loan.emiSchedule ?? []).map((emi, i) => [
    i + 1,
    emi.emiLabel ?? "N/A",
    emi.dueDate ? new Date(emi.dueDate).toLocaleDateString() : "N/A",
    `Rs.${emi.principalComponent ?? "0.00"}`,
    `Rs.${emi.interestComponent ?? "0.00"}`,
    `Rs.${emi.totalEMI ?? "0.00"}`,
    emi.isPaid ? " Paid" : " Pending",
  ]);

  autoTable(doc, {
    head: [
      ["#", "EMI", "Due Date", "Principal", "Interest", "Total EMI", "Status"],
    ],
    body: emiRows,
    startY: 120,
    theme: "grid",
    styles: { halign: "center" },
    headStyles: { fillColor: [178, 34, 34] },
  });

  doc.save(`Loan_Receipt_L${loan.loanId ?? "Unknown"}.pdf`);
};
