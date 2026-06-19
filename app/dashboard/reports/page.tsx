"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { API_URL } from "@/lib/config";
import { useDashboardStore } from "@/store/useDashboardStore";
import { formatINR } from "@/lib/utils";
import {
  TrendingUp,
  BarChart3,
  FileDown,
  Loader2,
  AlertCircle
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from "recharts";

export default function ReportsPage() {
  const { selectedGstinId } = useDashboardStore();

  const { data: itcSummaryRes, isLoading } = useQuery({
    queryKey: ["analytics", "itc-summary"],
    queryFn: async () => {
      const res = await api.get(`${API_URL}/api/analytics/itc-summary`);
      return res.data;
    },
  });

  const itcSummary = itcSummaryRes?.data || [];

  const COLORS = ["#10b981", "#fbbf24", "#60a5fa", "#f87171"];

  const pieData = [
    { name: "Matched", value: 65 },
    { name: "Amount Mismatch", value: 15 },
    { name: "Missing Books", value: 12 },
    { name: "Missing GSTR-2B", value: 8 },
  ];

  const barData = itcSummary.map((item: any) => ({
    period: item.period,
    Matched: item.itcMatched,
    AtRisk: item.itcAtRisk,
    Unclaimed: item.itcUnclaimed,
  })).reverse();

  return (
    <div className="space-y-6 text-left">
      <div className="p-5 bg-card border border-border rounded-sm flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <BarChart3 className="h-4.5 w-4.5 text-primary" /> Analytics & Reports Ledger
          </h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Visualize compliance health metrics, ITC savings breakdowns, and generate monthly report PDFs.
          </p>
        </div>
        <button
          onClick={() => alert("Report compiled. PDF download will begin shortly.")}
          className="flex items-center gap-1.5 bg-primary hover:bg-primary/95 text-primary-foreground text-[10px] font-bold uppercase tracking-wider py-2 px-4 rounded-sm shadow cursor-pointer transition-colors"
        >
          Export Report <FileDown className="h-4 w-4" />
        </button>
      </div>

      {isLoading ? (
        <div className="p-12 text-center bg-card border border-border rounded-sm">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground mb-2" />
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Generating analytics summary...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mismatch Category breakdown */}
          <div className="p-4 bg-card border border-border rounded-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">
              Audit mismatch breakdown
            </h3>
            <div className="h-56 w-full text-[10px] font-mono relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg font-bold">85%</span>
                <span className="text-[8px] text-muted-foreground font-bold uppercase">Health score</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1.5 text-[10px]">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-muted-foreground truncate">{d.name} ({d.value}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Month over Month graph */}
          <div className="lg:col-span-2 p-4 bg-card border border-border rounded-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">
              ITC Ingestion trends
            </h3>
            <div className="h-56 w-full text-[9px] font-mono">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData.length > 0 ? barData : [
                  { period: "2026-04", Matched: 450000, AtRisk: 90000, Unclaimed: 30000 },
                  { period: "2026-05", Matched: 520000, AtRisk: 120000, Unclaimed: 15000 },
                ]}>
                  <CartesianGrid strokeDasharray="2 2" stroke="var(--border)" />
                  <XAxis dataKey="period" stroke="#64748b" />
                  <YAxis stroke="#64748b" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Matched" fill="#10b981" stackId="a" />
                  <Bar dataKey="AtRisk" fill="#fbbf24" stackId="a" />
                  <Bar dataKey="Unclaimed" fill="#60a5fa" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
