/* ------------------------------------------------------------------
   GST Due Date Calendar — Rule Engine & Override Layer
   ------------------------------------------------------------------
   Base rules are derived from the standard GST return schedule.
   Ad-hoc CBIC extensions are modelled through the override table.
   No external API is used because the government does not publish
   structured due-date data; overrides must be added manually.
   ------------------------------------------------------------------ */

export type TaxpayerCategory = "Regular" | "Composition" | "TDS";
export type TurnoverBracket = "> ₹5 Cr" | "> ₹2 Cr" | "≤ ₹5 Cr (QRMP)" | "All";
export type StateGroup = "Group A" | "Group B" | "All";

export interface DueDateOverride {
  returnType: string;
  periodLabel: string;
  originalDueDate: string; // YYYY-MM-DD
  extendedDueDate: string; // YYYY-MM-DD
  reason: string;
}

export interface DueDateEntry {
  id: string;
  returnType: string;
  frequency: string;
  periodLabel: string;
  description: string;
  category: TaxpayerCategory;
  turnoverBracket: TurnoverBracket;
  stateGroup: StateGroup;
  baseDueDate: Date;
  extendedDueDate: Date | null;
  extensionReason: string | null;
  finalDueDate: Date;
  daysLeft: number;
  status: "upcoming" | "due-today" | "overdue";
  isOverridden: boolean;
}

export interface BaseRule {
  id: string;
  returnType: string;
  frequency: string;
  description: string;
  category: TaxpayerCategory;
  turnoverBracket: TurnoverBracket;
  stateGroup: StateGroup;
  generate: (fyStartYear: number) => Array<{ periodLabel: string; dueDate: Date }>;
}

const MS_PER_DAY = 86_400_000;
export const FY_MONTHS = [
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
  "Jan",
  "Feb",
  "Mar",
];

function startOfDay(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function parseDate(input: string): Date {
  const [y, m, day] = input.split("-").map(Number);
  return new Date(y, m - 1, day);
}

function periodMonthLabel(m: number, fyStartYear: number): string {
  const year = m <= 8 ? fyStartYear : fyStartYear + 1;
  return `${FY_MONTHS[m]} ${year}`;
}

/* ------------------- Generators ------------------- */

function monthlyGenerator(day: number, options?: { skipQuarterEndMonths?: boolean }) {
  return (fyStartYear: number) => {
    const dates: Array<{ periodLabel: string; dueDate: Date }> = [];
    for (let m = 0; m < 12; m++) {
      if (options?.skipQuarterEndMonths && (m + 1) % 3 === 0) continue;
      const periodLabel = periodMonthLabel(m, fyStartYear);
      // Next calendar month after the tax period.
      const dueMonthIndex = (m + 4) % 12;
      const dueYear = fyStartYear + Math.floor((m + 4) / 12);
      dates.push({ periodLabel, dueDate: new Date(dueYear, dueMonthIndex, day) });
    }
    return dates;
  };
}

function quarterlyGenerator(day: number) {
  return (fyStartYear: number) => {
    const qLabels = ["Q1 (Apr-Jun)", "Q2 (Jul-Sep)", "Q3 (Oct-Dec)", "Q4 (Jan-Mar)"];
    const dueMonths = [6, 9, 0, 3]; // Jul, Oct, Jan, Apr
    const yearOffsets = [0, 0, 1, 1];

    return qLabels.map((label, i) => {
      const fyEndShort = (fyStartYear + 1) % 100;
      const periodLabel = `${label} FY ${fyStartYear}-${fyEndShort}`;
      const dueYear = fyStartYear + yearOffsets[i];
      return { periodLabel, dueDate: new Date(dueYear, dueMonths[i], day) };
    });
  };
}

function annualGenerator(month: number, day: number) {
  return (fyStartYear: number) => {
    return [
      {
        periodLabel: `FY ${fyStartYear}-${(fyStartYear + 1) % 100}`,
        dueDate: new Date(fyStartYear + 1, month, day),
      },
    ];
  };
}

/* ------------------- Base Rules ------------------- */

export const BASE_RULES: BaseRule[] = [
  {
    id: "gstr1-monthly",
    returnType: "GSTR-1",
    frequency: "Monthly",
    description: "Outward supplies — monthly filers (> ₹5 Cr)",
    category: "Regular",
    turnoverBracket: "> ₹5 Cr",
    stateGroup: "All",
    generate: monthlyGenerator(11),
  },
  {
    id: "gstr1-qrmp",
    returnType: "GSTR-1",
    frequency: "Quarterly",
    description: "Outward supplies — QRMP filers (≤ ₹5 Cr)",
    category: "Regular",
    turnoverBracket: "≤ ₹5 Cr (QRMP)",
    stateGroup: "All",
    generate: quarterlyGenerator(13),
  },
  {
    id: "gstr3b-monthly",
    returnType: "GSTR-3B",
    frequency: "Monthly",
    description: "Summary return — monthly filers (> ₹5 Cr)",
    category: "Regular",
    turnoverBracket: "> ₹5 Cr",
    stateGroup: "All",
    generate: monthlyGenerator(20),
  },
  {
    id: "gstr3b-qrmp-a",
    returnType: "GSTR-3B",
    frequency: "Quarterly",
    description: "Summary return — QRMP Group A states",
    category: "Regular",
    turnoverBracket: "≤ ₹5 Cr (QRMP)",
    stateGroup: "Group A",
    generate: quarterlyGenerator(22),
  },
  {
    id: "gstr3b-qrmp-b",
    returnType: "GSTR-3B",
    frequency: "Quarterly",
    description: "Summary return — QRMP Group B states",
    category: "Regular",
    turnoverBracket: "≤ ₹5 Cr (QRMP)",
    stateGroup: "Group B",
    generate: quarterlyGenerator(24),
  },
  {
    id: "pmt-06",
    returnType: "PMT-06",
    frequency: "Monthly",
    description: "QRMP tax payment challan (first two months of each quarter)",
    category: "Regular",
    turnoverBracket: "≤ ₹5 Cr (QRMP)",
    stateGroup: "All",
    generate: monthlyGenerator(25, { skipQuarterEndMonths: true }),
  },
  {
    id: "cmp-08",
    returnType: "CMP-08",
    frequency: "Quarterly",
    description: "Composition taxpayer quarterly statement",
    category: "Composition",
    turnoverBracket: "All",
    stateGroup: "All",
    generate: quarterlyGenerator(18),
  },
  {
    id: "gstr-4",
    returnType: "GSTR-4",
    frequency: "Annual",
    description: "Composition taxpayer annual return",
    category: "Composition",
    turnoverBracket: "All",
    stateGroup: "All",
    generate: annualGenerator(5, 30), // 30th June
  },
  {
    id: "gstr-7",
    returnType: "GSTR-7",
    frequency: "Monthly",
    description: "TDS return",
    category: "TDS",
    turnoverBracket: "All",
    stateGroup: "All",
    generate: monthlyGenerator(10),
  },
  {
    id: "gstr-9",
    returnType: "GSTR-9",
    frequency: "Annual",
    description: "Annual return (turnover > ₹2 Cr)",
    category: "Regular",
    turnoverBracket: "> ₹2 Cr",
    stateGroup: "All",
    generate: annualGenerator(11, 31), // 31st December
  },
  {
    id: "gstr-9c",
    returnType: "GSTR-9C",
    frequency: "Annual",
    description: "Reconciliation statement (turnover > ₹5 Cr)",
    category: "Regular",
    turnoverBracket: "> ₹5 Cr",
    stateGroup: "All",
    generate: annualGenerator(11, 31),
  },
];

/* ------------------- Override Table ------------------- */

export const DUE_DATE_OVERRIDES: DueDateOverride[] = [
  {
    returnType: "GSTR-3B",
    periodLabel: "Mar 2026",
    originalDueDate: "2026-04-20",
    extendedDueDate: "2026-04-21",
    reason:
      "CBIC ad-hoc notification extends the due date for March 2026 monthly GSTR-3B filers by one day.",
  },
];

/* ------------------- Helpers ------------------- */

export function getFinancialYears(): string[] {
  const now = new Date();
  const currentFYStart =
    now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  return Array.from({ length: 5 }, (_, i) => currentFYStart - 2 + i).map(
    (y) => `${y}-${y + 1}`
  );
}

export function parseFY(value: string): number {
  return parseInt(value.split("-")[0], 10);
}

export function currentFYInfo(): { fyLabel: string; fyStartYear: number; fyMonthIndex: number } {
  const now = new Date();
  const fyStartYear = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  const fyMonthIndex = now.getMonth() >= 3 ? now.getMonth() - 3 : now.getMonth() + 9;
  return { fyLabel: `${fyStartYear}-${fyStartYear + 1}`, fyStartYear, fyMonthIndex };
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function getCalendarMonthForFYMonth(
  fyMonthIndex: number,
  fyStartYear: number
): { year: number; month: number } {
  const calendarMonth = (fyMonthIndex + 3) % 12;
  const yearOffset = Math.floor((fyMonthIndex + 3) / 12);
  return { year: fyStartYear + yearOffset, month: calendarMonth };
}

export const GROUP_A_STATES = [
  "Chhattisgarh",
  "Madhya Pradesh",
  "Gujarat",
  "Daman & Diu",
  "Dadra & Nagar Haveli",
  "Maharashtra",
  "Karnataka",
  "Goa",
  "Kerala",
  "Tamil Nadu",
  "Telangana",
  "Andhra Pradesh",
  "Puducherry",
  "Andaman & Nicobar Islands",
  "Lakshadweep",
];

export const GROUP_B_STATES = [
  "Jammu & Kashmir",
  "Ladakh",
  "Himachal Pradesh",
  "Punjab",
  "Chandigarh",
  "Uttarakhand",
  "Haryana",
  "Delhi",
  "Rajasthan",
  "Uttar Pradesh",
  "Bihar",
  "Sikkim",
  "Arunachal Pradesh",
  "Nagaland",
  "Manipur",
  "Mizoram",
  "Tripura",
  "Meghalaya",
  "Assam",
  "West Bengal",
  "Jharkhand",
  "Odisha",
];

/* ------------------- Main Generator ------------------- */

export function generateDueDates(fyStartYear: number): DueDateEntry[] {
  const today = startOfDay(new Date());
  const overrideKey = (returnType: string, periodLabel: string) =>
    `${returnType}|${periodLabel}`;
  const overrideMap = new Map<string, DueDateOverride>();
  DUE_DATE_OVERRIDES.forEach((o) =>
    overrideMap.set(overrideKey(o.returnType, o.periodLabel), o)
  );

  const entries: DueDateEntry[] = [];

  for (const rule of BASE_RULES) {
    for (const { periodLabel, dueDate } of rule.generate(fyStartYear)) {
      const override = overrideMap.get(overrideKey(rule.returnType, periodLabel));
      const finalDueDate = override
        ? startOfDay(parseDate(override.extendedDueDate))
        : startOfDay(dueDate);
      const diffDays = Math.floor(
        (finalDueDate.getTime() - today.getTime()) / MS_PER_DAY
      );
      const status: DueDateEntry["status"] =
        diffDays > 0 ? "upcoming" : diffDays === 0 ? "due-today" : "overdue";

      entries.push({
        id: `${rule.id}|${periodLabel}`,
        returnType: rule.returnType,
        frequency: rule.frequency,
        periodLabel,
        description: rule.description,
        category: rule.category,
        turnoverBracket: rule.turnoverBracket,
        stateGroup: rule.stateGroup,
        baseDueDate: dueDate,
        extendedDueDate: override ? startOfDay(parseDate(override.extendedDueDate)) : null,
        extensionReason: override?.reason ?? null,
        finalDueDate,
        daysLeft: diffDays,
        status,
        isOverridden: !!override,
      });
    }
  }

  return entries.sort((a, b) => a.finalDueDate.getTime() - b.finalDueDate.getTime());
}
