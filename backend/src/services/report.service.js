import * as saleService from "./sale.service.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

// Normalize date range (VERY IMPORTANT)
const normalizeDates = (startDate, endDate) => {
  const start = startDate
    ? new Date(startDate)
    : new Date("1970-01-01");

  const end = endDate
    ? new Date(endDate + "T23:59:59.999")
    : new Date();

  return { start, end };
};

// Generate sales report (JSON)
export const generateSalesReport = async (startDate, endDate) => {
  const { start, end } = normalizeDates(startDate, endDate);

  const sales = await saleService.getSales({
    startDate: start,
    endDate: end,
  });

  let totalAmount = 0;
  sales.forEach((sale) => {
    totalAmount += sale.totalAmount;
  });

  return { sales, totalAmount };
};

// Generate sales report PDF
export const generateSalesReportPDF = async (startDate, endDate) => {
  const { sales, totalAmount } = await generateSalesReport(startDate, endDate);

  if (!sales.length) {
    throw new Error("No sales found for selected date range");
  }

  if (!fs.existsSync("reports")) {
    fs.mkdirSync("reports");
  }

  const filePath = path.join(
    "reports",
    `sales-report-${Date.now()}.pdf`
  );

  const doc = new PDFDocument({ margin: 30 });
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text("Sales Report", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(
    `Date Range: ${startDate || "All"} → ${endDate || "Today"}`
  );
  doc.moveDown();

  sales.forEach((sale, idx) => {
    doc
      .fontSize(11)
      .text(
        `${idx + 1}. Employee: ${sale.employee?.name || "N/A"}`
      );
    doc.text(`   Date: ${new Date(sale.createdAt).toLocaleString()}`);
    doc.text(`   Total: ${sale.totalAmount}`);
    doc.text("   Items:");

    sale.items.forEach((item) => {
      doc.text(
        `      - ${item.name} x${item.quantity} @ ${item.price}`
      );
    });

    doc.moveDown();
  });

  doc
    .fontSize(14)
    .text(`Grand Total: ${totalAmount}`, { align: "right" });

  doc.end();

  return filePath;
};
