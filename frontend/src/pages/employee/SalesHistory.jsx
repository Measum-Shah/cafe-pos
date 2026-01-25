import React, { useEffect, useState } from "react";
import {
  History,
  Calendar,
  Filter,
  Receipt,
  ArrowRight,
  Download
} from "lucide-react";

import PageWrapper from "../../components/layout/PageWrapper";
import { getSales } from "../../api/sales.api";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";

const SalesHistory = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalAmount, setTotalAmount] = useState(0); // new state for total sum

  // ---------------- FETCH SALES ----------------
  const fetchSales = async () => {
    try {
      setLoading(true);

      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await getSales(params);

      const salesList = res.sales || [];

      setSales(salesList);

      // compute total amount for filtered sales
      const sum = salesList.reduce((acc, s) => acc + (s.totalAmount || 0), 0);
      setTotalAmount(sum);

    } catch (err) {
      console.error("Fetch sales error:", err);
      setSales([]);
      setTotalAmount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // ---------------- HELPERS ----------------
  const getTotalItems = (items = []) => items.reduce((sum, i) => sum + i.quantity, 0);

  // ---------------- UI ----------------
  return (
    <PageWrapper
      title="Sales History"
      actions={
        <Button
          variant="secondary"
          onClick={() => window.print()}
          icon={Download}
        >
          Export Logs
        </Button>
      }
    >

      {/* FILTER BAR */}
      <div className="bg-[#121212] border border-[#2a2a2a] p-6 rounded-[2rem] mb-8">
        <div className="flex flex-col lg:flex-row items-end gap-6">

          <div className="flex-1 w-full space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
              Period Start
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d4af37]" size={18} />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white"
              />
            </div>
          </div>

          <ArrowRight className="hidden lg:block mb-4 text-[#2a2a2a]" />

          <div className="flex-1 w-full space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
              Period End
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d4af37]" size={18} />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white"
              />
            </div>
          </div>

          <Button
            onClick={fetchSales}
            icon={Filter}
            className="h-[52px] px-8 bg-[#d4af37] text-black"
          >
            Check Sales
          </Button>

        </div>
      </div>

      {/* DATA */}
      {loading ? (
        <Loader />
      ) : sales.length === 0 ? (
        <div className="bg-[#121212] border-2 border-dashed border-[#2a2a2a] rounded-[2rem] p-24 text-center">
          <History size={64} className="mx-auto mb-4 opacity-10 text-[#d4af37]" />
          <h3 className="text-xl font-bold text-white mb-2">No Records Found</h3>
        </div>
      ) : (
        <div className="bg-[#121212] border border-[#2a2a2a] rounded-[2rem] overflow-hidden">

          <table className="w-full text-left">

            <thead>
              <tr className="bg-[#1a1a1a] border-b border-[#2a2a2a]">
                <th className="px-8 py-5 text-[10px] uppercase">Invoice</th>
                <th className="px-8 py-5 text-[10px] uppercase">Employee</th>
                <th className="px-8 py-5 text-[10px] uppercase">Items</th>
                <th className="px-8 py-5 text-[10px] uppercase text-center">Amount</th>
                <th className="px-8 py-5 text-[10px] uppercase text-right">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#2a2a2a]">

              {sales.map((s) => (
                <tr key={s._id} className="hover:bg-[#d4af37]/5">

                  {/* Invoice */}
                  <td className="px-8 py-6 flex items-center gap-3">
                    <Receipt className="text-[#d4af37]" size={18} />
                    <span className="font-mono text-white">
                      #{s._id.slice(-6).toUpperCase()}
                    </span>
                  </td>

                  {/* Employee */}
                  <td className="px-8 py-6 text-gray-300">
                    {s.employeeName || "System Operator"}
                  </td>

                  {/* Items */}
                  <td className="px-8 py-6 text-white">
                    {getTotalItems(s.items)} Items
                  </td>

                  {/* Amount */}
                  <td className="px-8 py-6 text-center font-bold text-[#d4af37]">
                    Rs. {s.totalAmount}
                  </td>

                  {/* Date */}
                  <td className="px-8 py-6 text-right text-gray-300">
                    {new Date(s.createdAt).toLocaleString()}
                  </td>

                </tr>
              ))}

            </tbody>

            {/* TOTAL ROW */}
            <tfoot>
              <tr className="bg-[#1a1a1a] border-t border-[#2a2a2a]">
                <td colSpan={3} className="px-8 py-6 text-right font-bold text-white">
                  Total
                </td>
                <td className="px-8 py-6 text-center font-bold text-[#d4af37]">
                  Rs. {totalAmount}
                </td>
                <td></td>
              </tr>
            </tfoot>

          </table>

        </div>
      )}

    </PageWrapper>
  );
};

export default SalesHistory;
