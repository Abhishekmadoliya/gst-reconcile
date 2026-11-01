export interface ErpColumnMapping {
  supplierGstin: string;
  supplierName: string;
  invoiceNo: string;
  invoiceDate: string;
  taxableValue: string;
  igst: string;
  cgst: string;
  sgst: string;
  cess?: string;
  total?: string;
  invoiceValue?: string;
}

export interface ErpPreset {
  id: string;
  name: string;
  tagline: string;
  description: string;
  badge?: string;
  popular?: boolean;
  exportFormat: string;
  mappings: ErpColumnMapping;
  sampleColumns: string[];
}

export const ERP_PRESETS: ErpPreset[] = [
  {
    id: "auto",
    name: "Auto-Detect ERP Headers",
    tagline: "TaxSolver Smart Parser",
    description: "Automatically detects over 35+ column variations from any accounting software without manual configuration.",
    popular: true,
    badge: "Recommended",
    exportFormat: "Excel (.xlsx) or CSV",
    mappings: {
      supplierGstin: "Party GSTIN / GSTIN / GST No.",
      supplierName: "Particulars / Party Name / Vendor",
      invoiceNo: "Vch No. / Invoice No. / Bill No.",
      invoiceDate: "Date / Invoice Date / Voucher Date",
      taxableValue: "Taxable Value / Base Amount",
      igst: "Integrated Tax / IGST Amount",
      cgst: "Central Tax / CGST Amount",
      sgst: "State Tax / SGST Amount",
      cess: "Cess Amount",
      invoiceValue: "Gross Total / Bill Amount",
    },
    sampleColumns: ["Vch No.", "Date", "Particulars", "Party GSTIN", "Taxable Amount", "Integrated Tax", "Central Tax", "State Tax", "Total"],
  },
  {
    id: "tally",
    name: "Tally Prime / ERP 9",
    tagline: "Default Columnar Register & GSTR-2 Export",
    description: "Matches Tally Prime's standard Purchase Register columnar layout with multi-head ledger totals.",
    popular: true,
    badge: "Official Preset",
    exportFormat: "Excel (.xlsx)",
    mappings: {
      supplierGstin: "Party GSTIN",
      supplierName: "Particulars",
      invoiceNo: "Vch No.",
      invoiceDate: "Date",
      taxableValue: "Gross Total",
      igst: "Integrated Tax",
      cgst: "Central Tax",
      sgst: "State Tax",
      cess: "Cess",
      invoiceValue: "Invoice Value",
    },
    sampleColumns: ["Vch No.", "Date", "Particulars", "Voucher Type", "Party GSTIN", "Gross Total", "Integrated Tax", "Central Tax", "State Tax", "Invoice Value"],
  },
  {
    id: "zoho",
    name: "Zoho Books",
    tagline: "Zoho Bills & Purchase Register Export",
    description: "Pre-configured for Zoho Books 'Bills Details' report and Purchase by Vendor export files.",
    exportFormat: "CSV / Excel (.xlsx)",
    mappings: {
      supplierGstin: "Vendor GSTIN",
      supplierName: "Vendor Name",
      invoiceNo: "Bill Number",
      invoiceDate: "Bill Date",
      taxableValue: "Taxable Amount",
      igst: "IGST",
      cgst: "CGST",
      sgst: "SGST",
      cess: "Cess",
      invoiceValue: "Total",
    },
    sampleColumns: ["Bill Number", "Bill Date", "Vendor Name", "Vendor GSTIN", "Taxable Amount", "IGST", "CGST", "SGST", "Cess", "Total"],
  },
  {
    id: "marg",
    name: "Marg ERP 9+",
    tagline: "Marg Purchase Voucher List",
    description: "Designed for Marg ERP wholesale, pharma and retail GST Purchase Bill registers.",
    exportFormat: "Excel / CSV",
    mappings: {
      supplierGstin: "GST No",
      supplierName: "Party Name",
      invoiceNo: "Bill No",
      invoiceDate: "Bill Date",
      taxableValue: "Taxable Amt",
      igst: "IGST Amt",
      cgst: "CGST Amt",
      sgst: "SGST Amt",
      invoiceValue: "Bill Amount",
    },
    sampleColumns: ["Bill No", "Bill Date", "Party Name", "GST No", "Taxable Amt", "IGST Amt", "CGST Amt", "SGST Amt", "Bill Amount"],
  },
  {
    id: "busy",
    name: "Busy Accounting",
    tagline: "Busy GST Purchase Report",
    description: "Pre-mapped for Busy 18/21 Purchase Registers (Columnar and Summary formats).",
    exportFormat: "Excel (.xlsx)",
    mappings: {
      supplierGstin: "GSTIN/UIN",
      supplierName: "Party",
      invoiceNo: "Vch No.",
      invoiceDate: "Date",
      taxableValue: "Taxable",
      igst: "IGST",
      cgst: "CGST",
      sgst: "SGST",
      cess: "Cess Amount",
      invoiceValue: "Total Amount",
    },
    sampleColumns: ["Vch No.", "Date", "Party", "GSTIN/UIN", "Type", "Taxable", "IGST", "CGST", "SGST", "Cess Amount", "Total Amount"],
  },
  {
    id: "sap",
    name: "SAP Business One / S/4HANA",
    tagline: "SAP A/P Invoices Export",
    description: "Maps SAP A/P Invoice voucher dumps with Federal Tax ID and Tax Amount headers.",
    exportFormat: "Excel / CSV",
    mappings: {
      supplierGstin: "Federal Tax ID",
      supplierName: "Card Name",
      invoiceNo: "Document Number",
      invoiceDate: "Posting Date",
      taxableValue: "Base Amount",
      igst: "Tax Amount (IGST)",
      cgst: "Tax Amount (CGST)",
      sgst: "Tax Amount (SGST)",
      invoiceValue: "Doc Total",
    },
    sampleColumns: ["Document Number", "Posting Date", "Card Name", "Federal Tax ID", "Base Amount", "Tax Amount (IGST)", "Tax Amount (CGST)", "Tax Amount (SGST)", "Doc Total"],
  },
];

export function getErpPresetById(id: string): ErpPreset {
  return ERP_PRESETS.find((p) => p.id === id) || ERP_PRESETS[0];
}

