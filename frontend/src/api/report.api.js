import api from "../utils/axios";

// Get sales report (JSON)
export const getSalesReport = async (params) => {
  const res = await api.get("/reports", { params });
  return res.data;
};

// Get sales report PDF
export const getSalesReportPDF = async (params) => {
  const res = await api.get("/reports/pdf", {
    params,
    responseType: "blob",
  });
  return res.data;
};
