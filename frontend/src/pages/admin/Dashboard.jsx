import React, { useEffect, useState } from "react";
import PageWrapper from "../../components/layout/PageWrapper";
import { getUsers } from "../../api/user.api";
import { getCategories } from "../../api/category.api";
import { getProducts } from "../../api/product.api";
import { getSales } from "../../api/sales.api";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";
import Loader from "../../components/common/Loader";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    categories: 0,
    products: 0,
    salesToday: 0, // Total orders today
  });

  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [hotSelling, setHotSelling] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = (today.getMonth() + 1).toString().padStart(2, "0");
        const dd = today.getDate().toString().padStart(2, "0");
        const todayStr = `${yyyy}-${mm}-${dd}`;

        // ---------------- Fetch static counts ----------------
        const [usersData, categoriesData, productsData] = await Promise.all([
          getUsers(),
          getCategories(),
          getProducts(),
        ]);

        const userCount = Array.isArray(usersData) ? usersData.length : usersData.users?.length || 0;
        const categoryCount = Array.isArray(categoriesData) ? categoriesData.length : categoriesData.categories?.length || 0;
        const productCount = Array.isArray(productsData) ? productsData.length : productsData.products?.length || 0;

        // ---------------- Fetch monthly sales ----------------
        const salesData = await getSales({ startDate: `${yyyy}-${mm}-01`, endDate: `${yyyy}-${mm}-31` });
        const salesThisMonth = salesData.sales || [];

        // ---------------- Compute sales today ----------------
        const salesToday = salesThisMonth.filter(sale => {
          const saleDate = new Date(sale.createdAt);
          return saleDate.toDateString() === today.toDateString();
        });

        // Total number of sales today = number of orders
        const salesTodayCount = salesToday.length;

        setStats({
          users: userCount,
          categories: categoryCount,
          products: productCount,
          salesToday: salesTodayCount,
        });

        // ---------------- Monthly Revenue Chart ----------------
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        const revenueByDay = Array(daysInMonth).fill(0);
        const productQuantities = {};

        salesThisMonth.forEach(sale => {
          const saleDate = new Date(sale.createdAt);
          if (saleDate.getMonth() === today.getMonth()) {
            const dayIndex = saleDate.getDate() - 1;
            revenueByDay[dayIndex] += sale.totalAmount || 0;

            // Hot-selling product
            (sale.items || []).forEach(item => {
              const name = item.name || item.product?.name || "Unknown";
              const qty = item.quantity || 0;
              productQuantities[name] = (productQuantities[name] || 0) + qty;
            });
          }
        });

        // ---------------- Hot-selling product ----------------
        let hotProduct = null;
        let maxQty = 0;
        Object.entries(productQuantities).forEach(([name, qty]) => {
          if (qty > maxQty) {
            maxQty = qty;
            hotProduct = { name, quantity: qty };
          }
        });
        setHotSelling(hotProduct);

        // ---------------- Chart ----------------
        const labels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
        setChartData({
          labels,
          datasets: [
            {
              label: "Revenue (Rs)",
              data: revenueByDay,
              fill: true,
              borderColor: "rgba(99, 102, 241, 1)",
              backgroundColor: "rgba(99, 102, 241, 0.2)",
              tension: 0.3,
              pointRadius: 4,
            },
          ],
        });

      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statItems = [
    { title: "Users", count: stats.users },
    { title: "Categories", count: stats.categories },
    { title: "Products", count: stats.products },
    { title: "Sales Today", count: stats.salesToday },
  ];

  if (loading) return <Loader />;

  return (
    <PageWrapper>
      <h1 className="text-3xl font-bold mb-6 text-[color:var(--color-primary)]">
        Admin Dashboard
      </h1>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statItems.map(stat => (
          <div
            key={stat.title}
            className="p-6 bg-[color:var(--color-bg-card)] rounded-2xl shadow hover:shadow-lg transition"
          >
            <h2 className="text-lg text-[color:var(--color-text-secondary)]">{stat.title}</h2>
            <p className="mt-2 text-2xl font-bold text-[color:var(--color-text-primary)]">{stat.count}</p>
          </div>
        ))}
      </div>

      {/* MONTHLY REVENUE CHART */}
      <div className="bg-[color:var(--color-bg-card)] p-6 rounded-2xl shadow mb-10">
        <h2 className="text-xl font-bold mb-4 text-[color:var(--color-text-primary)]">Revenue This Month</h2>
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: { legend: { display: false }, tooltip: { mode: "index", intersect: false } },
            scales: {
              x: { title: { display: true, text: "Day of Month" } },
              y: { title: { display: true, text: "Revenue (Rs)" }, beginAtZero: true },
            },
          }}
        />
      </div>

      {/* HOT-SELLING PRODUCT */}
      {hotSelling && (
        <div className="bg-[color:var(--color-bg-card)] p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-2 text-[color:var(--color-text-primary)]">
            Hot Selling Product of the Month
          </h2>
          <p className="text-[color:var(--color-text-secondary)] text-sm mb-2">
            Highest sold product this month based on quantity
          </p>
          <div className="p-4 bg-[color:var(--color-bg-light)] rounded-xl flex justify-between items-center">
            <span className="font-bold text-lg">{hotSelling.name}</span>
            <span className="text-lg text-[color:var(--color-success)]">{hotSelling.quantity} units</span>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default Dashboard;
