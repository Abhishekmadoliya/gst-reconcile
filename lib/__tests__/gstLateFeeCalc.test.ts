import { describe, it, expect } from "vitest";
import {
  daysBetweenInclusive,
  lateFeePerDay,
  getCap,
  calculateLateFee,
  calculateInterest,
  calculateGstLateFeeAndInterest,
  isBlocked,
  type GstReturnType,
} from "../gstLateFeeCalc";

function d(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day);
}

describe("daysBetweenInclusive", () => {
  it("returns 0 for same day", () => {
    expect(daysBetweenInclusive(d(2026, 1, 20), d(2026, 1, 20))).toBe(0);
  });

  it("counts day after due date to filing date", () => {
    // Due 20 Jan, filed 23 Jan => 3 days late
    expect(daysBetweenInclusive(d(2026, 1, 20), d(2026, 1, 23))).toBe(3);
  });

  it("returns 0 when filed before due date", () => {
    expect(daysBetweenInclusive(d(2026, 1, 20), d(2026, 1, 18))).toBe(0);
  });
});

describe("lateFeePerDay", () => {
  it("charges ₹50/day for normal GSTR-3B/GSTR-1/GSTR-4", () => {
    expect(lateFeePerDay("GSTR-3B", false)).toBe(50);
    expect(lateFeePerDay("GSTR-1", false)).toBe(50);
    expect(lateFeePerDay("GSTR-4", false)).toBe(50);
  });

  it("charges ₹20/day for NIL GSTR-3B/GSTR-1/GSTR-4", () => {
    expect(lateFeePerDay("GSTR-3B", true)).toBe(20);
    expect(lateFeePerDay("GSTR-1", true)).toBe(20);
    expect(lateFeePerDay("GSTR-4", true)).toBe(20);
  });

  it("charges ₹50/day for GSTR-7 and ₹200/day for GSTR-9", () => {
    expect(lateFeePerDay("GSTR-7", false)).toBe(50);
    expect(lateFeePerDay("GSTR-9", false)).toBe(200);
  });
});

describe("getCap", () => {
  it("returns ₹500 cap for NIL returns", () => {
    const cap = getCap("GSTR-3B", true, 0);
    expect(cap.total).toBe(500);
    expect(cap.perHead).toBe(250);
  });

  it("uses turnover-based caps for normal returns", () => {
    expect(getCap("GSTR-3B", false, 1_00_00_000).total).toBe(2_000);
    expect(getCap("GSTR-1", false, 3_00_00_000).total).toBe(5_000);
    expect(getCap("GSTR-4", false, 6_00_00_000).total).toBe(10_000);
  });

  it("returns 0.5% of turnover for GSTR-9", () => {
    const cap = getCap("GSTR-9", false, 10_00_00_000);
    expect(cap.total).toBe(5_00_000);
    expect(cap.perHead).toBe(2_50_000);
  });
});

describe("calculateLateFee", () => {
  it("returns ₹0 when filed on time", () => {
    const fee = calculateLateFee("GSTR-3B", false, 10_00_00_000, 0);
    expect(fee.total).toBe(0);
  });

  it("matches the NIL sanity example: 3 days = ₹60", () => {
    const fee = calculateLateFee("GSTR-3B", true, 0, 3);
    expect(fee.cgst).toBe(30);
    expect(fee.sgst).toBe(30);
    expect(fee.total).toBe(60);
    expect(fee.wasCapped).toBe(false);
  });

  it("applies the turnover cap when daily fee exceeds it", () => {
    // 100 days at ₹50/day = ₹5,000; with turnover ≤ ₹1.5 Cr cap is ₹2,000
    const fee = calculateLateFee("GSTR-3B", false, 1_00_00_000, 100);
    expect(fee.total).toBe(2_000);
    expect(fee.wasCapped).toBe(true);
    expect(fee.capNote).toContain("₹2,000");
  });
});

describe("calculateInterest", () => {
  it("returns ₹0 when there is no delay", () => {
    const interest = calculateInterest(10_000, 10_000, 10_000, 0, "normal", 0);
    expect(interest.amount).toBe(0);
  });

  it("calculates 18% interest on cash liability only", () => {
    // Tax = 30,000 CGST + 30,000 SGST + 40,000 IGST = 1,00,000
    // ITC offset = 40,000 => cash base = 60,000
    // 30 days at 18% => (60,000 * 0.18 * 30) / 365 = 887.67
    const interest = calculateInterest(30_000, 30_000, 40_000, 40_000, "normal", 30);
    expect(interest.base).toBe(60_000);
    expect(interest.ratePercent).toBe(18);
    expect(interest.amount).toBeCloseTo(887.67, 1);
  });

  it("uses 24% rate for excess-itc scenario", () => {
    const interest = calculateInterest(50_000, 0, 0, 0, "excess-itc", 30);
    expect(interest.ratePercent).toBe(24);
    expect(interest.amount).toBeCloseTo((50_000 * 0.24 * 30) / 365, 1);
  });

  it("never lets interest base go negative", () => {
    const interest = calculateInterest(10_000, 0, 0, 50_000, "normal", 10);
    expect(interest.base).toBe(0);
    expect(interest.amount).toBe(0);
  });
});

describe("calculateGstLateFeeAndInterest — full integration", () => {
  it("sanity example: GSTR-3B NIL, 3 days late => ₹60 total", () => {
    const result = calculateGstLateFeeAndInterest({
      returnType: "GSTR-3B",
      dueDate: d(2026, 1, 20),
      filingDate: d(2026, 1, 23),
      isNil: true,
      cgst: 0,
      sgst: 0,
      igst: 0,
      itcOffset: 0,
      turnover: 0,
      interestScenario: "normal",
    });

    expect(result.daysDelayed).toBe(3);
    expect(result.lateFee.total).toBe(60);
    expect(result.interest.amount).toBe(0);
    expect(result.grandTotal).toBe(60);
    expect(result.summary).toContain("₹60");
  });

  it("returns zero for on-time filing", () => {
    const result = calculateGstLateFeeAndInterest({
      returnType: "GSTR-3B",
      dueDate: d(2026, 1, 20),
      filingDate: d(2026, 1, 20),
      isNil: false,
      cgst: 50_000,
      sgst: 50_000,
      igst: 0,
      itcOffset: 0,
      turnover: 2_00_00_000,
      interestScenario: "normal",
    });

    expect(result.daysDelayed).toBe(0);
    expect(result.grandTotal).toBe(0);
    expect(result.summary).toContain("on time");
  });

  it("flags returns blocked after 3 years", () => {
    const result = calculateGstLateFeeAndInterest({
      returnType: "GSTR-3B",
      dueDate: d(2020, 1, 20),
      filingDate: d(2024, 1, 25),
      isNil: true,
      cgst: 0,
      sgst: 0,
      igst: 0,
      itcOffset: 0,
      turnover: 0,
      interestScenario: "normal",
    });

    expect(result.isBlocked).toBe(true);
    expect(result.warning).toContain("permanently blocked");
  });
});

describe("isBlocked", () => {
  it("returns true only after 3 years from due date", () => {
    expect(isBlocked(d(2020, 1, 20), d(2023, 1, 21))).toBe(true);
    expect(isBlocked(d(2020, 1, 20), d(2023, 1, 20))).toBe(false);
  });
});
