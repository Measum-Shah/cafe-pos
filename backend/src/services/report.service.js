import * as saleService from "./sale.service.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

// Generate sales report by date range
export const generateSalesReport = async (startDate, endDate) => {
  const sales = await saleService.getSales(startDate, endDate);

  // Calculate totals
  let totalAmount = 0;
  sales.forEach(sale => {
    totalAmount += sale.totalAmount;
  });

  return { sales, totalAmount };
};

// Generate PDF for sales report
export const generateSalesReportPDF = async (startDate, endDate, filename = "sales-report.pdf") => {
  const { sales, totalAmount } = await generateSalesReport(startDate, endDate);

  const doc = new PDFDocument({ margin: 30 });
  const filePath = path.join("receipts", filename);

  // Create receipts folder if not exists
  if (!fs.existsSync("receipts")) fs.mkdirSync("receipts");

  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text("Sales Report", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Date Range: ${startDate || "All"} - ${endDate || "All"}`);
  doc.moveDown();

  sales.forEach((sale, idx) => {
    doc.text(
      `${idx + 1}. Employee: ${sale.employee.name} | Total: ${sale.totalAmount} | Date: ${sale.createdAt.toDateString()}`
    );
    sale.products.forEach(p => {
      doc.text(`   - ${p.product.name} x ${p.quantity} @ ${p.price}`);
    });
    doc.moveDown();
  });

  doc.text(`Grand Total: ${totalAmount}`, { align: "right" });

  doc.end();

  return { filePath, totalAmount };
};
