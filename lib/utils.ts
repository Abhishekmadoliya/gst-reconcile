import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format raw numbers into Indian Rupees (INR) format.
 * E.g., 123456.78 -> ₹1,23,456.78
 */
export function formatINR(value: number | string): string {
  const numericValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numericValue)) return "₹0.00";
  
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue);
}

/**
 * Format MMYYYY period into human readable text.
 * E.g., "042026" -> "Apr 2026"
 */
export function formatPeriod(period: string): string {
  if (!period || period.length !== 6) return period || "";
  
  const month = period.slice(0, 2);
  const year = period.slice(2);
  
  const monthMap: Record<string, string> = {
    "01": "Jan",
    "02": "Feb",
    "03": "Mar",
    "04": "Apr",
    "05": "May",
    "06": "Jun",
    "07": "Jul",
    "08": "Aug",
    "09": "Sep",
    "10": "Oct",
    "11": "Nov",
    "12": "Dec",
  };
  
  return `${monthMap[month] || month} ${year}`;
}
