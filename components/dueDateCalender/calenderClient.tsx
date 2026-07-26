"use client";

import { useState, useMemo } from "react";
import {
  Calendar,
  Search,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Info,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type DueDateEntry,
  type TaxpayerCategory,
  type TurnoverBracket,
  type StateGroup,
  BASE_RULES,
  FY_MONTHS,
  getFinancialYears,
  parseFY,
  currentFYInfo,
  formatDate,
  sameDay,
  getCalendarMonthForFYMonth,
  generateDueDates,
  GROUP_A_STATES,
  GROUP_B_STATES,
} from "@/lib/gstDueDates";

const ITEMS_PER_PAGE = 20;

const RETURN_TYPE_OPTIONS = [
  "All",
  ...Array.from(new Set(BASE_RULES.map((r) => r.returnType))),
].sort();

const CATEGORY_OPTIONS: (TaxpayerCategory | "All")[] = [
  "All",
  "Regular",
  "Composition",
  "TDS",
];

const TURNOVER_OPTIONS: (TurnoverBracket | "All")[] = [
  "All",
  "> ₹5 Cr",
  "> ₹2 Cr",
  "≤ ₹5 Cr (QRMP)",
];

const STATE_GROUP_OPTIONS: (StateGroup | "All")[] = [
  "All",
  "Group A",
  "Group B",
];

const MONTH_OPTIONS: { label: string; value: number | "All" }[] = [
  { label: "All", value: "All" },
  ...FY_MONTHS.map((m, i) => ({ label: m, value: i })),
];

export default function CalenderClient() {
  const today = new Date();
  const current = currentFYInfo();

  const [fyLabel, setFyLabel] = useState(current.fyLabel);
  const [monthFilter, setMonthFilter] = useState<number | "All">(current.fyMonthIndex);
  const [returnTypeFilter, setReturnTypeFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState<TaxpayerCategory | "All">("All");
  const [turnoverFilter, setTurnoverFilter] = useState<TurnoverBracket | "All">("All");
  const [stateGroupFilter, setStateGroupFilter] = useState<StateGroup | "All">("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);

  const fyStartYear = parseFY(fyLabel);

  const allEntries = useMemo(() => generateDueDates(fyStartYear), [fyStartYear]);

  const filteredEntries = useMemo(() => {
    const mapMonthToCalendar = (monthIdx: number | "All"): { year: number; month: number } | null => {
      if (monthIdx === "All") return null;
      return getCalendarMonthForFYMonth(monthIdx as number, fyStartYear);
    };
    const calTarget = mapMonthToCalendar(monthFilter);
    return allEntries.filter((e) => {
      if (calTarget) {
        const due = e.finalDueDate;
        if (due.getFullYear() !== calTarget.year || due.getMonth() !== calTarget.month) return false;
      }
      if (returnTypeFilter !== "All" && e.returnType !== returnTypeFilter) return false;
      if (categoryFilter !== "All" && e.category !== categoryFilter) return false;
      if (turnoverFilter !== "All" && e.turnoverBracket !== turnoverFilter) return false;
      if (stateGroupFilter !== "All") {
        if (e.stateGroup !== "All" && e.stateGroup !== stateGroupFilter) return false;
      }
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matches =
          e.returnType.toLowerCase().includes(q) ||
          e.frequency.toLowerCase().includes(q) ||
          e.periodLabel.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [allEntries, monthFilter, fyStartYear, returnTypeFilter, categoryFilter, turnoverFilter, stateGroupFilter, searchTerm]);

  const [prevFilters, setPrevFilters] = useState("");
  const filtersKey = `${fyLabel}|${monthFilter}|${returnTypeFilter}|${categoryFilter}|${turnoverFilter}|${stateGroupFilter}|${searchTerm}`;
  if (filtersKey !== prevFilters) {
    setPrevFilters(filtersKey);
    if (page !== 0) setPage(0);
  }

  const totalPages = Math.max(1, Math.ceil(filteredEntries.length / ITEMS_PER_PAGE));
  const paginatedEntries = filteredEntries.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  const total = filteredEntries.length;
  const upcoming = filteredEntries.filter((e) => e.status === "upcoming").length;
  const dueToday = filteredEntries.filter((e) => e.status === "due-today").length;
  const overdue = filteredEntries.filter((e) => e.status === "overdue").length;

  const calTarget = monthFilter !== "All"
    ? getCalendarMonthForFYMonth(monthFilter as number, fyStartYear)
    : null;

  const calendarDays = useMemo(() => {
    if (!calTarget) return null;
    const { year, month } = calTarget;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return { year, month, days, daysInMonth };
  }, [calTarget]);

  const getEntriesForDay = (day: number) => {
    if (!calTarget) return [];
    const date = new Date(calTarget.year, calTarget.month, day);
    return filteredEntries.filter((e) => sameDay(e.finalDueDate, date));
  };

  const resetFilters = () => {
    setMonthFilter(current.fyMonthIndex);
    setReturnTypeFilter("All");
    setCategoryFilter("All");
    setTurnoverFilter("All");
    setStateGroupFilter("All");
    setSearchTerm("");
    setPage(0);
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "upcoming": return "text-success bg-success-bg border-success/20";
      case "due-today": return "text-warn bg-warn-bg border-warn/20";
      case "overdue": return "text-alert bg-alert-bg border-alert/20";
      default: return "text-muted-foreground bg-muted border-border";
    }
  };

  const dayHeadings = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="w-full space-y-5">

      {/* Filters Card */}
      <div className="border border-border bg-card rounded-xl shadow-lg overflow-hidden">
        <div className="bg-muted px-4 py-3 border-b border-border flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">Filters</span>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">FY</label>
              <select value={fyLabel} onChange={(e) => { setFyLabel(e.target.value); setPage(0); }}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring mt-1">
                {getFinancialYears().map((fy) => (<option key={fy} value={fy}>{fy}</option>))}
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Month</label>
              <select value={monthFilter} onChange={(e) => { const v = e.target.value; setMonthFilter(v === "All" ? "All" : Number(v)); setPage(0); }}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring mt-1">
                {MONTH_OPTIONS.map((opt) => (<option key={String(opt.value)} value={String(opt.value)}>{opt.label}</option>))}
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Return Type</label>
              <select value={returnTypeFilter} onChange={(e) => { setReturnTypeFilter(e.target.value); setPage(0); }}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring mt-1">
                {RETURN_TYPE_OPTIONS.map((rt) => (<option key={rt} value={rt}>{rt}</option>))}
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Category</label>
              <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value as TaxpayerCategory | "All"); setPage(0); }}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring mt-1">
                {CATEGORY_OPTIONS.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Turnover</label>
              <select value={turnoverFilter} onChange={(e) => { setTurnoverFilter(e.target.value as TurnoverBracket | "All"); setPage(0); }}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring mt-1">
                {TURNOVER_OPTIONS.map((t) => (<option key={t} value={t}>{t}</option>))}
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">State Group</label>
              <select value={stateGroupFilter} onChange={(e) => { setStateGroupFilter(e.target.value as StateGroup | "All"); setPage(0); }}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring mt-1">
                {STATE_GROUP_OPTIONS.map((s) => (<option key={s} value={s}>{s}</option>))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <button onClick={resetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border bg-background hover:bg-muted text-[11px] font-semibold rounded-lg transition-colors cursor-pointer text-muted-foreground">
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
            <div className="hidden md:flex items-center gap-4 text-[9px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-info" />
                Group A: {GROUP_A_STATES.slice(0, 3).join(", ")}...
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-warn" />
                Group B: {GROUP_B_STATES.slice(0, 3).join(", ")}...
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Due Dates", value: total, color: "" },
          { label: "Upcoming", value: upcoming, color: "text-success" },
          { label: "Due Today", value: dueToday, color: "text-warn" },
          { label: "Overdue", value: overdue, color: "text-alert" },
        ].map(({ label, value, color }) => (
          <div key={label} className="border border-border bg-card rounded-lg p-3">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">{label}</span>
            <span className={cn("text-2xl font-black", color)}>{value}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      {calendarDays && (
        <div className="border border-border bg-card rounded-xl shadow-lg overflow-hidden">
          <div className="bg-muted px-4 py-3 border-b border-border flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-bold text-foreground">
              {FY_MONTHS[monthFilter as number]} {calTarget!.year}
            </span>
          </div>
          <div className="p-3">
            <div className="grid grid-cols-7 gap-1 text-[9px] font-bold text-muted-foreground uppercase text-center mb-1">
              {dayHeadings.map((d) => (<div key={d} className="py-1">{d}</div>))}
            </div>
            <div className="grid grid-cols-7 gap-0.5">
              {calendarDays.days.map((day, idx) => {
                if (day === null) return <div key={`empty-${idx}`} className="aspect-square rounded-lg bg-transparent" />;
                const dueOnThisDay = getEntriesForDay(day);
                const isToday = calTarget && today.getFullYear() === calTarget.year && today.getMonth() === calTarget.month && today.getDate() === day;
                return (
                  <div key={`day-${day}`}
                    className={cn(
                      "relative flex flex-col items-center justify-center aspect-square rounded text-[11px] transition-colors border border-transparent",
                      isToday ? "border-primary bg-primary/5 font-bold" : "hover:bg-muted",
                      dueOnThisDay.length > 0 && "bg-muted/60"
                    )}
                    title={dueOnThisDay.length > 0 ? dueOnThisDay.map((e) => `${e.returnType} (${e.periodLabel})${e.isOverridden ? " → Extended" : ""}`).join("\n") : undefined}>
                    <span className={cn(isToday && "text-primary")}>{day}</span>
                    {dueOnThisDay.length > 0 && (
                      <span className="flex gap-0.5 mt-0.5">
                        {dueOnThisDay.slice(0, 3).map((_, i) => (<span key={i} className="inline-block w-1 h-1 rounded-full bg-primary" />))}
                        {dueOnThisDay.length > 3 && <span className="text-[7px] text-muted-foreground">+{dueOnThisDay.length - 3}</span>}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Entries Table */}
      <div className="border border-border bg-card rounded-xl shadow-lg overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input type="text" placeholder="Search by return type, period, or description..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
            className="bg-transparent border-0 outline-0 ring-0 text-xs w-full placeholder:text-muted-foreground text-foreground" />
        </div>

        {paginatedEntries.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-muted/40 border-b border-border text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    <th className="px-3 py-2.5">Return Type</th>
                    <th className="px-3 py-2.5">Period</th>
                    <th className="px-3 py-2.5 hidden sm:table-cell">Category</th>
                    <th className="px-3 py-2.5 hidden md:table-cell">Turnover</th>
                    <th className="px-3 py-2.5 hidden md:table-cell">State</th>
                    <th className="px-3 py-2.5">Base Due Date</th>
                    <th className="px-3 py-2.5 hidden lg:table-cell">Extended</th>
                    <th className="px-3 py-2.5 text-center">Status</th>
                    <th className="px-3 py-2.5 text-right">Days</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-[11px]">
                  {paginatedEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-3 py-2.5 whitespace-nowrap font-semibold">
                        {entry.returnType}
                        <span className="text-[9px] text-muted-foreground ml-1 font-mono">({entry.frequency})</span>
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">{entry.periodLabel}</td>
                      <td className="px-3 py-2.5 whitespace-nowrap hidden sm:table-cell">{entry.category}</td>
                      <td className="px-3 py-2.5 whitespace-nowrap text-[10px] hidden md:table-cell">
                        {entry.turnoverBracket === "All" ? <span className="text-muted-foreground">—</span> : entry.turnoverBracket}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap hidden md:table-cell">
                        {entry.stateGroup === "All" ? <span className="text-muted-foreground">—</span> : (
                          <span className={cn("inline-flex px-1.5 py-0.5 rounded-full text-[8px] font-semibold",
                            entry.stateGroup === "Group A" ? "bg-info-bg text-info border border-info/20" : "bg-warn-bg text-warn border border-warn/20")}>
                            {entry.stateGroup}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap font-mono text-[10px]">{formatDate(entry.baseDueDate)}</td>
                      <td className="px-3 py-2.5 whitespace-nowrap hidden lg:table-cell">
                        {entry.isOverridden ? (
                          <span className="flex items-center gap-1 text-info text-[10px]">
                            {formatDate(entry.extendedDueDate!)}
                            <span className="cursor-help text-[8px] bg-info-bg text-info px-1 py-0.5 rounded-full" title={entry.extensionReason || ""}>
                              <Info className="h-2.5 w-2.5 inline" />
                            </span>
                          </span>
                        ) : <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="px-3 py-2.5 text-center whitespace-nowrap">
                        <span className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-[8px] font-bold", statusBadge(entry.status))}>
                          {entry.status === "upcoming" && <CheckCircle2 className="h-2.5 w-2.5" />}
                          {entry.status === "due-today" && <Clock className="h-2.5 w-2.5" />}
                          {entry.status === "overdue" && <AlertCircle className="h-2.5 w-2.5" />}
                          {entry.status === "upcoming" && "Upcoming"}
                          {entry.status === "due-today" && "Due Today"}
                          {entry.status === "overdue" && "Overdue"}
                        </span>
                      </td>
                      <td className={cn("px-3 py-2.5 text-right whitespace-nowrap font-bold text-[11px]",
                        entry.status === "upcoming" && "text-success",
                        entry.status === "due-today" && "text-warn",
                        entry.status === "overdue" && "text-alert")}>
                        {entry.daysLeft > 0 ? `in ${entry.daysLeft}d` : entry.daysLeft === 0 ? "Today" : `${Math.abs(entry.daysLeft)}d overdue`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border text-[11px] text-muted-foreground">
                <span>{page * ITEMS_PER_PAGE + 1}–{Math.min((page + 1) * ITEMS_PER_PAGE, filteredEntries.length)} of {filteredEntries.length}</span>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
                    className="inline-flex h-7 w-7 items-center justify-center border border-border bg-background hover:bg-muted disabled:opacity-40 rounded-md transition-colors cursor-pointer">
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </button>
                  <span className="font-semibold px-2">{page + 1} of {totalPages}</span>
                  <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                    className="inline-flex h-7 w-7 items-center justify-center border border-border bg-background hover:bg-muted disabled:opacity-40 rounded-md transition-colors cursor-pointer">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="px-6 py-8 text-center text-muted-foreground text-xs">No due dates found matching the selected filters.</div>
        )}
      </div>

      <div className="text-[10px] text-muted-foreground leading-relaxed text-center">
        Base due dates as per standard GST rules. Overrides (shown in <span className="text-info font-semibold">blue</span>) reflect CBIC ad-hoc extensions.
      </div>
    </div>
  );
}
