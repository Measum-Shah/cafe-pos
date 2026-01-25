import React, { useState } from "react";
import { 
  LineChart, 
  Calendar, 
  Download, 
  FileText, 
  TrendingUp, 
  PackageCheck, 
  ArrowRight
} from "lucide-react";
import PageWrapper from "../../components/layout/PageWrapper";
import { getSalesReport } from "../../api/report.api";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";
import { Line } from "react-chartjs-2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Reports = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [sales, setSales] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalUnits, setTotalUnits] = useState(0);

  const fetchReport = async () => {
    if (!startDate || !endDate) return alert("Please select a valid date range");

    try {
      setLoading(true);

      const data = await getSalesReport({ startDate, endDate });
      if (!data.sales?.length) {
        setSales([]);
        setChartData({ labels: [], datasets: [] });
        setTotalRevenue(0);
        setTotalUnits(0);
        return;
      }

      // ------------------- Flatten sales & filter Unknown -------------------
      const flattened = [];
      let revenueByDate = {};
      let totalRev = 0;
      let totalQty = 0;

      data.sales.forEach((sale) => {
        const saleItems = sale.items || [];
        saleItems.forEach((item) => {
          const name = item.name || item.product?.name;
          const price = item.price ?? item.product?.price;

          if (!name || price == null) return; // skip Unknown items

          const itemTotal = price * item.quantity;

          flattened.push({
            _id: sale._id,
            productName: name,
            quantity: item.quantity,
            total: itemTotal,
            date: sale.createdAt,
            employee: sale.employeeName || sale.employee?.name || "System Operator",
          });

          const dateStr = new Date(sale.createdAt).toLocaleDateString();
          revenueByDate[dateStr] = (revenueByDate[dateStr] || 0) + itemTotal;

          totalRev += itemTotal;
          totalQty += item.quantity;
        });
      });

      setSales(flattened);
      setTotalRevenue(totalRev);
      setTotalUnits(totalQty);

      // ------------------- Line chart -------------------
      const labels = Object.keys(revenueByDate).sort((a, b) => new Date(a) - new Date(b));
      const dataSet = labels.map((d) => revenueByDate[d]);
      setChartData({
        labels,
        datasets: [
          {
            label: "Revenue (Rs)",
            data: dataSet,
            borderColor: "rgba(99, 102, 241, 1)",
            backgroundColor: "rgba(99, 102, 241, 0.2)",
            tension: 0.3,
            fill: true,
            pointRadius: 4,
          },
        ],
      });

      // Generate PDF
      generatePDF(flattened, totalRev, totalQty);

    } catch (err) {
      console.error(err);
      setSales([]);
      setChartData({ labels: [], datasets: [] });
      setTotalRevenue(0);
      setTotalUnits(0);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = (flattenedSales, totalRev, totalQty) => {
    if (!flattenedSales.length) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // ------------------- Top-center header on first page -------------------
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("POS MADE by DIGIZONE Solutions", pageWidth / 2, 14, { align: "center" });

    doc.setFontSize(20);
    doc.text("Cafe POS - Financial Report", 14, 25);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Range: ${startDate} to ${endDate}`, 14, 33);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 38);

    // ------------------- Table -------------------
    autoTable(doc, {
      head: [["#", "Product", "Qty", "Revenue", "Sale Date"]],
      body: flattenedSales.map((s, idx) => [
        idx + 1,
        s.productName,
        s.quantity,
        `Rs ${s.total.toFixed(2)}`,
        new Date(s.date).toLocaleDateString(),
      ]),
      startY: 45,
      theme: "striped",
      headStyles: { fillColor: [99, 102, 241] },
    });

    // ------------------- Totals -------------------
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Total Units Sold: ${totalQty}`, 14, finalY);
    doc.text(`Total Revenue: Rs ${totalRev.toFixed(2)}`, 14, finalY + 8);

    // ------------------- Bottom-center text on last page -------------------
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("For Such Software Contact at 03217387179", pageWidth / 2, pageHeight - 10, { align: "center" });

    doc.save(`POS_Report_${startDate}_to_${endDate}.pdf`);
  };

  return (
    <PageWrapper
      title="Financial Reports"
      actions={
        sales.length > 0 && (
          <Button
            onClick={() => generatePDF(sales, totalRevenue, totalUnits)}
            icon={Download}
            variant="secondary"
          >
            Export PDF
          </Button>
        )
      }
    >
      {/* DATE FILTER */}
      <div className="bg-[var(--color-bg-card)] p-6 rounded-2xl border border-[var(--color-border)] mb-8 shadow-sm">
        <div className="flex flex-col lg:flex-row items-end gap-6">
          <div className="flex-1 w-full space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-[var(--color-text-secondary)] ml-1">
              Start Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-primary)]" size={18} />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] outline-none"
              />
            </div>
          </div>

          <ArrowRight className="hidden lg:block mb-4 text-[var(--color-border)]" />

          <div className="flex-1 w-full space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-[var(--color-text-secondary)] ml-1">
              End Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-primary)]" size={18} />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-primary)] outline-none"
              />
            </div>
          </div>

          <Button onClick={fetchReport} icon={LineChart} className="h-[52px] px-8">
            Generate Report
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="py-20"><Loader /></div>
      ) : sales.length > 0 ? (
        <>
          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-[var(--color-bg-card)] p-6 rounded-2xl border border-[var(--color-border)] flex items-center gap-5 shadow-inner">
              <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center">
                <TrendingUp size={28} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Total Revenue</p>
                <h3 className="text-3xl font-black text-[var(--color-success)]">Rs {totalRevenue.toFixed(2)}</h3>
              </div>
            </div>
            <div className="bg-[var(--color-bg-card)] p-6 rounded-2xl border border-[var(--color-border)] flex items-center gap-5 shadow-inner">
              <div className="w-14 h-14 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center">
                <PackageCheck size={28} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Items Sold</p>
                <h3 className="text-3xl font-black">{totalUnits} units</h3>
              </div>
            </div>
          </div>

          {/* LINE CHART */}
          <div className="bg-[var(--color-bg-card)] p-6 rounded-2xl border border-[var(--color-border)] mb-8 shadow-inner">
            <Line
              data={chartData}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: true, title: { display: true, text: "Revenue (Rs)" } },
                  x: { title: { display: true, text: "Date" } },
                },
              }}
            />
          </div>
        </>
      ) : (
        <div className="bg-[var(--color-bg-card)] border-2 border-dashed border-[var(--color-border)] rounded-3xl p-24 text-center">
          <FileText size={64} className="mx-auto mb-4 opacity-10 text-[var(--color-primary)]" />
          <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">Ready to analyze?</h3>
          <p className="text-[var(--color-text-secondary)] max-w-sm mx-auto">
            Select a date range above to generate a detailed sales and revenue breakdown.
          </p>
        </div>
      )}
    </PageWrapper>
  );
};

export default Reports;
