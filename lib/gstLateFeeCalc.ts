/* ------------------------------------------------------------------
   GST Late Fee & Interest Calculator — Pure Calculation Module
   ------------------------------------------------------------------
   References (last verified: 26 Jul 2026):
   • Late fee: Section 47 of the CGST Act, as notified by CBIC.
   • Interest: Section 50 of the CGST Act read with Rule 88B.
   • Normal interest rate = 18% p.a.; 24% p.a. applies to excess / wrongful ITC
     claimed or output tax liability reduced incorrectly.
   • Portal auto-computes interest on the cash-ledger portion (net of ITC)
     effective Jan 2026.

   All functions below are pure: no side effects, no portal calls, no DOM.
   ------------------------------------------------------------------ */

export type GstReturnType = "GSTR-3B" | "GSTR-1" | "GSTR-4" | "GSTR-7" | "GSTR-9";
export type InterestScenario = "normal" | "excess-itc";

export interface CalculationInput {
  returnType: GstReturnType;
  dueDate: Date;
  filingDate: Date;
  isNil: boolean;
  cgst: number;
  sgst: number;
  igst: number;
  itcOffset: number;
  turnover: number;
  interestScenario: InterestScenario;
}

export interface LateFeeBreakdown {
  cgst: number;
  sgst: number;
  total: number;
  wasCapped: boolean;
  capNote: string;
}

export interface InterestBreakdown {
  base: number; // cash-paid tax liability
  ratePercent: number;
  days: number;
  amount: number;
}

export interface ChallanSplit {
  cgst: number;
  sgst: number;
  igst: number;
}

export interface CalculationResult {
  daysDelayed: number;
  isBlocked: boolean;
  lateFee: LateFeeBreakdown;
  interest: InterestBreakdown;
  grandTotal: number;
  challan: ChallanSplit;
  summary: string;
  warning: string | null;
}

const MS_PER_DAY = 86_400_000;
const THREE_YEARS_IN_MS = 3 * 365 * MS_PER_DAY; // approximate block threshold

function startOfDay(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function daysBetweenInclusive(start: Date, end: Date): number {
  const a = startOfDay(start).getTime();
  const b = startOfDay(end).getTime();
  const diff = b - a;
  return Math.max(0, Math.floor(diff / MS_PER_DAY));
}

export function isBlocked(dueDate: Date, filingDate: Date): boolean {
  const delayMs = startOfDay(filingDate).getTime() - startOfDay(dueDate).getTime();
  return delayMs > THREE_YEARS_IN_MS;
}

function clampNonNegative(n: number): number {
  return Math.max(0, n);
}

function roundMoney(n: number): number {
  return Math.round(n * 100) / 100;
}

function formatINR(n: number): string {
  return n.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });
}

function isNilEligible(returnType: GstReturnType): boolean {
  return returnType === "GSTR-3B" || returnType === "GSTR-1" || returnType === "GSTR-4";
}

export function lateFeePerDay(returnType: GstReturnType, isNil: boolean): number {
  // IGST has no late-fee component; only CGST + SGST are charged.
  switch (returnType) {
    case "GSTR-3B":
    case "GSTR-1":
    case "GSTR-4":
      return isNil ? 20 : 50;
    case "GSTR-7":
      return 50;
    case "GSTR-9":
      return 200;
    default:
      return 0;
  }
}

export function getCap(
  returnType: GstReturnType,
  isNil: boolean,
  turnover: number
): { total: number; perHead: number; note: string } {
  switch (returnType) {
    case "GSTR-3B":
    case "GSTR-1":
    case "GSTR-4": {
      if (isNil) {
        return { total: 500, perHead: 250, note: "capped at ₹500 for NIL returns" };
      }
      if (turnover <= 1_50_00_000) {
        return {
          total: 2_000,
          perHead: 1_000,
          note: "capped at ₹2,000 (turnover ≤ ₹1.5 Cr)",
        };
      }
      if (turnover <= 5_00_00_000) {
        return {
          total: 5_000,
          perHead: 2_500,
          note: "capped at ₹5,000 (turnover ₹1.5 Cr – ₹5 Cr)",
        };
      }
      return {
        total: 10_000,
        perHead: 5_000,
        note: "capped at ₹10,000 (turnover > ₹5 Cr)",
      };
    }
    case "GSTR-7": {
      return { total: 2_000, perHead: 1_000, note: "capped at ₹2,000" };
    }
    case "GSTR-9": {
      const total = turnover * 0.005; // 0.5% total
      const perHead = turnover * 0.0025; // 0.25% CGST + 0.25% SGST
      return {
        total,
        perHead,
        note: "capped at 0.5% of state/UT turnover",
      };
    }
    default:
      return { total: Infinity, perHead: Infinity, note: "" };
  }
}

export function calculateLateFee(
  returnType: GstReturnType,
  isNil: boolean,
  turnover: number,
  daysDelayed: number
): LateFeeBreakdown {
  if (daysDelayed <= 0) {
    return {
      cgst: 0,
      sgst: 0,
      total: 0,
      wasCapped: false,
      capNote: "",
    };
  }

  const perDay = lateFeePerDay(returnType, isNil && isNilEligible(returnType));
  const rawTotal = perDay * daysDelayed;
  const rawCgst = (perDay / 2) * daysDelayed;
  const rawSgst = rawCgst;

  const cap = getCap(returnType, isNil && isNilEligible(returnType), turnover);

  if (rawTotal <= cap.total || cap.total === Infinity) {
    return {
      cgst: roundMoney(rawCgst),
      sgst: roundMoney(rawSgst),
      total: roundMoney(rawTotal),
      wasCapped: false,
      capNote: `cap: ₹${formatINR(cap.total)} ${cap.note}`,
    };
  }

  return {
    cgst: roundMoney(cap.perHead),
    sgst: roundMoney(cap.perHead),
    total: roundMoney(cap.total),
    wasCapped: true,
    capNote: cap.note,
  };
}

export function calculateInterest(
  cgst: number,
  sgst: number,
  igst: number,
  itcOffset: number,
  interestScenario: InterestScenario,
  daysDelayed: number
): InterestBreakdown {
  if (daysDelayed <= 0) {
    return { base: 0, ratePercent: 0, days: 0, amount: 0 };
  }

  const totalTax = clampNonNegative(cgst) + clampNonNegative(sgst) + clampNonNegative(igst);
  const offset = clampNonNegative(itcOffset);
  const cashBase = clampNonNegative(totalTax - offset);
  const ratePercent = interestScenario === "excess-itc" ? 24 : 18;
  const amount = (cashBase * (ratePercent / 100) * daysDelayed) / 365;

  return {
    base: roundMoney(cashBase),
    ratePercent,
    days: daysDelayed,
    amount: roundMoney(amount),
  };
}

export function calculateGstLateFeeAndInterest(input: CalculationInput): CalculationResult {
  const returnType = input.returnType;
  const isNil = isNilEligible(returnType) ? input.isNil : false;
  const daysDelayed = daysBetweenInclusive(input.dueDate, input.filingDate);

  const lateFee = calculateLateFee(returnType, isNil, input.turnover, daysDelayed);

  const interest = isNil
    ? { base: 0, ratePercent: 0, days: 0, amount: 0 }
    : calculateInterest(
        input.cgst,
        input.sgst,
        input.igst,
        input.itcOffset,
        input.interestScenario,
        daysDelayed
      );

  // Challan-ready split
  const interestSplit =
    interest.base > 0
      ? {
          cgst: (interest.amount * clampNonNegative(input.cgst)) / interest.base,
          sgst: (interest.amount * clampNonNegative(input.sgst)) / interest.base,
          igst: (interest.amount * clampNonNegative(input.igst)) / interest.base,
        }
      : { cgst: 0, sgst: 0, igst: 0 };

  const challan: ChallanSplit = {
    cgst: roundMoney(lateFee.cgst + interestSplit.cgst),
    sgst: roundMoney(lateFee.sgst + interestSplit.sgst),
    igst: roundMoney(interestSplit.igst),
  };

  const grandTotal = roundMoney(lateFee.total + interest.amount);
  const filingBlocked = daysDelayed > 0 && isBlocked(input.dueDate, input.filingDate);

  const warning = filingBlocked
    ? "Returns filed more than 3 years after the original due date are permanently blocked on the GST portal."
    : null;

  const summary =
    daysDelayed === 0
      ? `Filed on time — no late fee or interest.`
      : `You owe ₹${formatINR(lateFee.total)} late fee + ₹${formatINR(
          interest.amount
        )} interest = ₹${formatINR(grandTotal)} total, for filing ${daysDelayed} day${
          daysDelayed === 1 ? "" : "s"
        } late.`;

  return {
    daysDelayed,
    isBlocked: filingBlocked,
    lateFee,
    interest,
    grandTotal,
    challan,
    summary,
    warning,
  };
}

/* ------------------------------------------------------------------
   Due-date helpers (used by the UI to pre-fill the form).
   Accept either a tax-period Date or an explicit FY start year.
   ------------------------------------------------------------------ */

export function getDefaultDueDate(
  returnType: GstReturnType,
  period: Date,
  filingFrequency: "monthly" | "quarterly" | "annual" = "monthly"
): Date {
  const p = startOfDay(period);
  const y = p.getFullYear();
  const m = p.getMonth();

  switch (returnType) {
    case "GSTR-3B":
      // 20th of next month for monthly; QRMP quarters land on 22nd/24th,
      // so we only pre-fill the monthly default here and let the user edit.
      return new Date(y, m + 1, 20);
    case "GSTR-1":
      if (filingFrequency === "quarterly") {
        // 13th of month after quarter ends
        return new Date(y, m + 1, 13);
      }
      return new Date(y, m + 1, 11);
    case "GSTR-7":
      return new Date(y, m + 1, 10);
    case "GSTR-9":
      // 31st December of next FY
      return new Date(y + 1, 11, 31);
    case "GSTR-4":
      // 30th June of next FY (composition annual return)
      return new Date(y + 1, 5, 30);
    default:
      return new Date(y, m + 1, 20);
  }
}

export function getInterestRateLabel(scenario: InterestScenario): string {
  return scenario === "excess-itc"
    ? "24% — excess / wrongful ITC claimed"
    : "18% — standard late payment";
}
