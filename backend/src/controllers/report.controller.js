import * as reportService from "../services/report.service.js";

// Generate sales report (JSON)
export const getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const report = await reportService.generateSalesReport(startDate, endDate);
    res.status(200).json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Generate sales report PDF
export const getSalesReportPDF = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const { filePath, totalAmount } = await reportService.generateSalesReportPDF(
      startDate,
      endDate,
      `sales-report-${Date.now()}.pdf`
    );

    res.download(filePath); // send PDF as download
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
