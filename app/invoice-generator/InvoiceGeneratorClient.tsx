"use client";

import React, { useState, useEffect, useRef } from "react";
import { Upload, X, Plus } from "lucide-react";

interface GstItem {
    id: string;
    description: string;
    quantity: number;
    rate: number;
    sgst: number;
    cgst: number;
    cess: number;
}

export default function InvoiceGeneratorClient() {
    const [isClient, setIsClient] = useState(false);

    const [logo, setLogo] = useState<string | null>(null);
    const [title, setTitle] = useState("TAX INVOICE");

    const [company, setCompany] = useState({
        name: "Acme Solutions Pvt Ltd",
        person: "Rahul Sharma",
        gst: "07AABCA1234F1Z5",
        address: "B-12, Connaught Place",
        city: "New Delhi",
        state: "Delhi",
        country: "India"
    });

    const [billTo, setBillTo] = useState({
        name: "Globex Technologies Ltd",
        gst: "27AAACG5678H1Z2",
        address: "14, Marine Drive",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India"
    });

    const [meta, setMeta] = useState({
        invNo: "INV-12",
        invDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
        supply: "Maharashtra"
    });

    const [items, setItems] = useState<GstItem[]>([
        { id: "1", description: "Brochure Design", quantity: 2, rate: 100, sgst: 6, cgst: 6, cess: 0 },
        { id: "2", description: "Website Banner", quantity: 1, rate: 2500, sgst: 9, cgst: 9, cess: 0 }
    ]);

    const [notes, setNotes] = useState("Thanks for your business. Payment is due within 15 days.");
    const [terms, setTerms] = useState("Goods once sold will not be taken back. Subject to Delhi jurisdiction.");

    const [theme, setTheme] = useState("#E8711A");
    const [template, setTemplate] = useState("t-standard");
    const [toastMsg, setToastMsg] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setIsClient(true);
        loadDraft();
    }, []);

    const showToast = (msg: string) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(""), 2200);
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 1048576) return showToast("Logo must be under 1MB");

        const reader = new FileReader();
        reader.onload = () => setLogo(reader.result as string);
        reader.readAsDataURL(file);
    };

    const updateItem = (id: string, field: keyof GstItem, value: any) => {
        setItems(items.map(it => it.id === id ? { ...it, [field]: value } : it));
    };

    const addItem = () => {
        setItems([...items, {
            id: Date.now().toString(),
            description: "",
            quantity: 1,
            rate: 0,
            sgst: 9,
            cgst: 9,
            cess: 0
        }]);
    };

    const removeItem = (id: string) => {
        if (items.length < 2) return showToast("At least one item is required");
        setItems(items.filter(it => it.id !== id));
    };

    const fmt = (n: number) => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const numToWords = (n: number) => {
        const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
        const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
        const t = (x: number): string => x < 20 ? a[x] : b[Math.floor(x / 10)] + (x % 10 ? ' ' + a[x % 10] : '');
        const h = (x: number): string => (x > 99 ? a[Math.floor(x / 100)] + ' Hundred' + (x % 100 ? ' ' : '') : '') + (x % 100 ? t(x % 100) : '');

        let r = Math.floor(n);
        const p = Math.round((n - r) * 100);
        const o: string[] = [];

        [[10000000, 'Crore'], [100000, 'Lakh'], [1000, 'Thousand']].forEach(([v, l]) => {
            const val = v as number;
            if (r >= val) {
                o.push(h(Math.floor(r / val)) + ' ' + l);
                r %= val;
            }
        });

        if (r) o.push(h(r));
        let s = (o.join(' ') || 'Zero') + ' Rupees';
        if (p) s += ' and ' + t(p) + ' Paise';
        return s + ' Only';
    };

    // Calculations
    let subtotal = 0, totalSgst = 0, totalCgst = 0, totalCcess = 0;
    items.forEach(it => {
        const amt = it.quantity * it.rate;
        subtotal += amt;
        totalSgst += amt * (it.sgst / 100);
        totalCgst += amt * (it.cgst / 100);
        totalCcess += amt * (it.cess / 100);
    });
    const grandTotal = subtotal + totalSgst + totalCgst + totalCcess;

    const saveDraft = (quiet = false) => {
        try {
            const draft = { logo, title, company, billTo, meta, items, notes, terms, theme, template };
            localStorage.setItem('gst-invoice-draft', JSON.stringify(draft));
            if (!quiet) showToast("Invoice saved in this browser");
        } catch (e) {
            if (!quiet) showToast("Could not save (storage unavailable)");
        }
    };

    const loadDraft = () => {
        try {
            const d = JSON.parse(localStorage.getItem('gst-invoice-draft') || 'null');
            if (!d) return;
            if (d.logo !== undefined) setLogo(d.logo);
            if (d.title !== undefined) setTitle(d.title);
            if (d.company) setCompany(d.company);
            if (d.billTo) setBillTo(d.billTo);
            if (d.meta) setMeta(d.meta);
            if (d.items) setItems(d.items);
            if (d.notes !== undefined) setNotes(d.notes);
            if (d.terms !== undefined) setTerms(d.terms);
            if (d.theme !== undefined) setTheme(d.theme);
            if (d.template !== undefined) setTemplate(d.template);
        } catch (e) { }
    };

    const handlePrint = () => {
        document.title = meta.invNo || 'Invoice';
        window.print();
    };

    const reset = () => {
        try { localStorage.removeItem('gst-invoice-draft'); } catch (e) { }
        window.location.reload();
    };

    if (!isClient) return null;

    return (
        <div className="min-h-screen bg-[#F9FAFB] text-[#111827] font-sans pb-20 print:bg-white print:p-0">
            <style type="text/css" media="print">
                {`
          @page { size: auto; margin: 0mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
        `}
            </style>

            {/* Hero */}
            <div className="relative w-full bg-[#F9FAFB] py-16 overflow-hidden flex flex-col items-center text-center px-4 no-print border-b border-gray-200">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 text-gray-300 opacity-50">
                    <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                        <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="1" />
                        <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="1" />
                        <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="1" />
                        <circle cx="100" cy="100" r="100" stroke="currentColor" strokeWidth="1" />
                        <circle cx="100" cy="100" r="120" stroke="currentColor" strokeWidth="1" />
                    </svg>
                </div>
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 text-gray-300 opacity-50">
                    <svg width="250" height="200" viewBox="0 0 250 200" fill="none">
                        <rect x="-50" y="100" width="150" height="150" rx="40" stroke="currentColor" strokeWidth="1" />
                        <rect x="-70" y="80" width="190" height="190" rx="60" stroke="currentColor" strokeWidth="1" />
                        <rect x="-90" y="60" width="230" height="230" rx="80" stroke="currentColor" strokeWidth="1" />
                        <rect x="-110" y="40" width="270" height="270" rx="100" stroke="currentColor" strokeWidth="1" />
                        <rect x="-130" y="20" width="310" height="310" rx="120" stroke="currentColor" strokeWidth="1" />
                    </svg>
                </div>
                
                <h1 className="text-[36px] md:text-[44px] font-black text-[#111827] tracking-tight z-10 max-w-2xl leading-[1.15] mb-4">
                    Free GST Invoice Generator Online
                </h1>
                <p className="text-[13px] md:text-[14px] text-gray-600 z-10 max-w-[620px] leading-relaxed mx-auto font-medium">
                    Generate standard, GST-compliant tax invoices with automatic CGST, SGST, IGST, and cess calculations. Customize themes, add your company logo, and download or print print-ready PDF invoices instantly.
                </p>
            </div>


            <div className="max-w-[1180px] mx-auto mt-6 px-4 flex flex-col lg:flex-row gap-6 items-start print:mt-0 print:p-0 print:max-w-none print:block">

                {/* Paper Wrap */}
                <div className="flex-1 w-full overflow-x-auto print:overflow-visible">
                    <div
                        className={`bg-white border border-[#E5E7EB] rounded-xl shadow-sm p-8 min-w-[640px] text-[13px] print:border-none print:shadow-none print:p-8 print:min-w-0 ${template === 't-compact' ? 'text-[12px] p-6' : ''}`}
                        style={{ '--accent': theme } as any}
                    >
                        {/* Top */}
                        <div className="flex justify-between items-start gap-4 mb-6">
                            <div
                                className={`w-[130px] h-[110px] border border-dashed border-blue-200 rounded-lg bg-blue-50/50 flex flex-col items-center justify-center text-blue-600 cursor-pointer hover:bg-blue-50 transition-colors relative overflow-hidden shrink-0 ${!logo ? 'no-print' : 'border-none bg-transparent'}`}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {logo ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={logo} alt="Logo" className="max-w-full max-h-full object-contain p-1" />
                                ) : (
                                    <>
                                        <Upload size={20} className="mb-1" />
                                        <span className="font-semibold text-xs">Upload</span>
                                    </>
                                )}
                            </div>
                            <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />

                            {!logo && (
                                <div className="text-[10px] text-gray-500 flex-1 pt-2 no-print">
                                    <b className="block text-xs text-gray-900 mb-1">Upload Logo</b>
                                    240 x 240 pixels @ 72 DPI, Maximum size of 1MB.
                                </div>
                            )}

                            <input
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className={`text-right font-light tracking-wide text-gray-900 border border-transparent hover:border-blue-200 focus:border-blue-600 focus:bg-blue-50 outline-none px-3 py-2 rounded transition-colors w-full max-w-[320px] print:border-none print:p-0 ${template === 't-compact' ? 'text-2xl' : 'text-3xl border-blue-200'}`}
                            />
                        </div>

                        {/* Company Info */}
                        <div className="max-w-[300px] flex flex-col gap-0.5 mb-5">
                            <input value={company.name} onChange={e => setCompany({ ...company, name: e.target.value })} placeholder="Your Company" className="font-semibold text-gray-900 border border-transparent hover:border-blue-200 focus:border-blue-600 focus:bg-blue-50 outline-none px-1.5 py-1 rounded transition-colors w-full print:border-none print:p-0" />
                            <input value={company.person} onChange={e => setCompany({ ...company, person: e.target.value })} placeholder="Your Name" className="font-semibold text-gray-900 border border-transparent hover:border-blue-200 focus:border-blue-600 focus:bg-blue-50 outline-none px-1.5 py-1 rounded transition-colors w-full print:border-none print:p-0" />
                            <input value={company.gst} onChange={e => setCompany({ ...company, gst: e.target.value })} placeholder="Company's GSTIN" className="text-gray-600 border border-transparent hover:border-blue-200 focus:border-blue-600 focus:bg-blue-50 outline-none px-1.5 py-1 rounded transition-colors w-full print:border-none print:p-0" />
                            <input value={company.address} onChange={e => setCompany({ ...company, address: e.target.value })} placeholder="Company's Address" className="text-gray-600 border border-transparent hover:border-blue-200 focus:border-blue-600 focus:bg-blue-50 outline-none px-1.5 py-1 rounded transition-colors w-full print:border-none print:p-0" />
                            <input value={company.city} onChange={e => setCompany({ ...company, city: e.target.value })} placeholder="City" className="text-gray-600 border border-transparent hover:border-blue-200 focus:border-blue-600 focus:bg-blue-50 outline-none px-1.5 py-1 rounded transition-colors w-full print:border-none print:p-0" />
                            <input value={company.state} onChange={e => setCompany({ ...company, state: e.target.value })} placeholder="State" className="text-gray-600 border border-transparent hover:border-blue-200 focus:border-blue-600 focus:bg-blue-50 outline-none px-1.5 py-1 rounded transition-colors w-full print:border-none print:p-0" />
                            <input value={company.country} onChange={e => setCompany({ ...company, country: e.target.value })} placeholder="Country" className="text-gray-600 border border-transparent hover:border-blue-200 focus:border-blue-600 focus:bg-blue-50 outline-none px-1.5 py-1 rounded transition-colors w-full print:border-none print:p-0" />
                        </div>

                        {/* Meta */}
                        <div className="grid grid-cols-2 gap-6 mb-4">
                            <div className="flex flex-col gap-0.5 items-start">
                                <h4 className="m-0 mb-1 text-[13px] font-bold">Bill To:</h4>
                                <input value={billTo.name} onChange={e => setBillTo({ ...billTo, name: e.target.value })} placeholder="Your Client's Company" className="text-gray-900 border border-transparent hover:border-blue-200 focus:border-blue-600 focus:bg-blue-50 outline-none px-1.5 py-1 rounded transition-colors w-full print:border-none print:p-0" />
                                <input value={billTo.gst} onChange={e => setBillTo({ ...billTo, gst: e.target.value })} placeholder="Client's GSTIN" className="text-gray-900 border border-transparent hover:border-blue-200 focus:border-blue-600 focus:bg-blue-50 outline-none px-1.5 py-1 rounded transition-colors w-full print:border-none print:p-0" />
                                <input value={billTo.address} onChange={e => setBillTo({ ...billTo, address: e.target.value })} placeholder="Client's Address" className="text-gray-900 border border-transparent hover:border-blue-200 focus:border-blue-600 focus:bg-blue-50 outline-none px-1.5 py-1 rounded transition-colors w-full print:border-none print:p-0" />
                                <input value={billTo.city} onChange={e => setBillTo({ ...billTo, city: e.target.value })} placeholder="City" className="text-gray-900 border border-transparent hover:border-blue-200 focus:border-blue-600 focus:bg-blue-50 outline-none px-1.5 py-1 rounded transition-colors w-full print:border-none print:p-0" />
                                <input value={billTo.state} onChange={e => setBillTo({ ...billTo, state: e.target.value })} placeholder="State" className="text-gray-900 border border-transparent hover:border-blue-200 focus:border-blue-600 focus:bg-blue-50 outline-none px-1.5 py-1 rounded transition-colors w-full print:border-none print:p-0" />
                                <input value={billTo.country} onChange={e => setBillTo({ ...billTo, country: e.target.value })} placeholder="Country" className="text-gray-900 border border-transparent hover:border-blue-200 focus:border-blue-600 focus:bg-blue-50 outline-none px-1.5 py-1 rounded transition-colors w-full print:border-none print:p-0" />
                            </div>

                            <div className="grid grid-cols-[100px_1fr] gap-x-2 gap-y-1.5 items-center content-start">
                                <label className="font-medium text-gray-800">Invoice#</label>
                                <input value={meta.invNo} onChange={e => setMeta({ ...meta, invNo: e.target.value })} className="text-gray-900 border border-transparent hover:border-blue-200 focus:border-blue-600 focus:bg-blue-50 outline-none px-1.5 py-1 rounded transition-colors w-full print:border-none print:p-0" />

                                <label className="font-medium text-gray-800">Invoice Date</label>
                                <input type="date" value={meta.invDate} onChange={e => setMeta({ ...meta, invDate: e.target.value })} className="text-gray-900 border border-transparent hover:border-blue-200 focus:border-blue-600 focus:bg-blue-50 outline-none px-1.5 py-1 rounded transition-colors w-full print:border-none print:p-0" />

                                <label className="font-medium text-gray-800">Due Date</label>
                                <input type="date" value={meta.dueDate} onChange={e => setMeta({ ...meta, dueDate: e.target.value })} className="text-gray-900 border border-transparent hover:border-blue-200 focus:border-blue-600 focus:bg-blue-50 outline-none px-1.5 py-1 rounded transition-colors w-full print:border-none print:p-0" />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mb-3 font-semibold text-gray-800">
                            Place Of Supply:
                            <input value={meta.supply} onChange={e => setMeta({ ...meta, supply: e.target.value })} placeholder="State" className="font-normal text-gray-900 border border-transparent hover:border-blue-200 focus:border-blue-600 focus:bg-blue-50 outline-none px-1.5 py-1 rounded transition-colors w-full max-w-[240px] print:border-none print:p-0" />
                        </div>

                        {/* Items Table */}
                        <table className={`w-full border-collapse mb-1 ${template === 't-spreadsheet' ? 'border border-gray-300' : ''}`}>
                            <thead>
                                <tr>
                                    <th className={`text-left p-2 text-[11px] font-bold ${template === 't-spreadsheet' ? 'bg-gray-100 text-gray-900 border border-gray-300 border-b-2' : template === 't-compact' ? 'bg-gray-100 border-t-2' : 'text-white'}`} style={{ backgroundColor: template === 't-standard' ? theme : undefined, borderColor: template !== 't-standard' ? theme : undefined, width: '34%' }}>Item Description</th>
                                    <th className={`text-right p-2 text-[11px] font-bold ${template === 't-spreadsheet' ? 'bg-gray-100 text-gray-900 border border-gray-300 border-b-2' : template === 't-compact' ? 'bg-gray-100 border-t-2' : 'text-white'}`} style={{ backgroundColor: template === 't-standard' ? theme : undefined, borderColor: template !== 't-standard' ? theme : undefined, width: '8%' }}>Qty</th>
                                    <th className={`text-right p-2 text-[11px] font-bold ${template === 't-spreadsheet' ? 'bg-gray-100 text-gray-900 border border-gray-300 border-b-2' : template === 't-compact' ? 'bg-gray-100 border-t-2' : 'text-white'}`} style={{ backgroundColor: template === 't-standard' ? theme : undefined, borderColor: template !== 't-standard' ? theme : undefined, width: '12%' }}>Rate</th>
                                    <th className={`text-right p-2 text-[11px] font-bold ${template === 't-spreadsheet' ? 'bg-gray-100 text-gray-900 border border-gray-300 border-b-2' : template === 't-compact' ? 'bg-gray-100 border-t-2' : 'text-white'}`} style={{ backgroundColor: template === 't-standard' ? theme : undefined, borderColor: template !== 't-standard' ? theme : undefined, width: '10%' }}>SGST %</th>
                                    <th className={`text-right p-2 text-[11px] font-bold ${template === 't-spreadsheet' ? 'bg-gray-100 text-gray-900 border border-gray-300 border-b-2' : template === 't-compact' ? 'bg-gray-100 border-t-2' : 'text-white'}`} style={{ backgroundColor: template === 't-standard' ? theme : undefined, borderColor: template !== 't-standard' ? theme : undefined, width: '10%' }}>CGST %</th>
                                    <th className={`text-right p-2 text-[11px] font-bold ${template === 't-spreadsheet' ? 'bg-gray-100 text-gray-900 border border-gray-300 border-b-2' : template === 't-compact' ? 'bg-gray-100 border-t-2' : 'text-white'}`} style={{ backgroundColor: template === 't-standard' ? theme : undefined, borderColor: template !== 't-standard' ? theme : undefined, width: '9%' }}>Cess %</th>
                                    <th className={`text-right p-2 text-[11px] font-bold ${template === 't-spreadsheet' ? 'bg-gray-100 text-gray-900 border border-gray-300 border-b-2' : template === 't-compact' ? 'bg-gray-100 border-t-2' : 'text-white'}`} style={{ backgroundColor: template === 't-standard' ? theme : undefined, borderColor: template !== 't-standard' ? theme : undefined, width: '14%' }}>Amount</th>
                                    <th className={`w-[3%] no-print ${template === 't-spreadsheet' ? 'border border-gray-300 bg-gray-100' : template === 't-compact' ? 'bg-gray-100 border-t-2' : ''}`} style={{ backgroundColor: template === 't-standard' ? theme : undefined, borderColor: template !== 't-standard' ? theme : undefined }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(it => (
                                    <tr key={it.id} className="border-b border-gray-200">
                                        <td className={`p-1 align-top ${template === 't-spreadsheet' ? 'border border-gray-300' : ''}`}>
                                            <input value={it.description} onChange={e => updateItem(it.id, 'description', e.target.value)} placeholder="Item description" className="w-full border border-transparent hover:border-blue-200 focus:border-blue-600 focus:bg-blue-50 outline-none px-1.5 py-1 rounded transition-colors print:border-none print:p-0" />
                                        </td>
                                        <td className={`p-1 align-top ${template === 't-spreadsheet' ? 'border border-gray-300' : ''}`}>
                                            <input type="number" min="0" value={it.quantity} onChange={e => updateItem(it.id, 'quantity', parseFloat(e.target.value) || 0)} className="w-full text-right border border-transparent hover:border-blue-200 focus:border-blue-600 focus:bg-blue-50 outline-none px-1.5 py-1 rounded transition-colors print:border-none print:p-0" />
                                        </td>
                                        <td className={`p-1 align-top ${template === 't-spreadsheet' ? 'border border-gray-300' : ''}`}>
                                            <input type="number" min="0" step="any" value={it.rate} onChange={e => updateItem(it.id, 'rate', parseFloat(e.target.value) || 0)} className="w-full text-right border border-transparent hover:border-blue-200 focus:border-blue-600 focus:bg-blue-50 outline-none px-1.5 py-1 rounded transition-colors print:border-none print:p-0" />
                                        </td>
                                        <td className={`p-1 align-top ${template === 't-spreadsheet' ? 'border border-gray-300' : ''}`}>
                                            <input type="number" min="0" step="any" value={it.sgst} onChange={e => updateItem(it.id, 'sgst', parseFloat(e.target.value) || 0)} className="w-full text-right border border-transparent hover:border-blue-200 focus:border-blue-600 focus:bg-blue-50 outline-none px-1.5 py-1 rounded transition-colors print:border-none print:p-0" />
                                            <div className="text-[11px] text-gray-500 text-right px-1.5">{(it.quantity * it.rate * it.sgst / 100).toFixed(2)}</div>
                                        </td>
                                        <td className={`p-1 align-top ${template === 't-spreadsheet' ? 'border border-gray-300' : ''}`}>
                                            <input type="number" min="0" step="any" value={it.cgst} onChange={e => updateItem(it.id, 'cgst', parseFloat(e.target.value) || 0)} className="w-full text-right border border-transparent hover:border-blue-200 focus:border-blue-600 focus:bg-blue-50 outline-none px-1.5 py-1 rounded transition-colors print:border-none print:p-0" />
                                            <div className="text-[11px] text-gray-500 text-right px-1.5">{(it.quantity * it.rate * it.cgst / 100).toFixed(2)}</div>
                                        </td>
                                        <td className={`p-1 align-top ${template === 't-spreadsheet' ? 'border border-gray-300' : ''}`}>
                                            <input type="number" min="0" step="any" value={it.cess} onChange={e => updateItem(it.id, 'cess', parseFloat(e.target.value) || 0)} className="w-full text-right border border-transparent hover:border-blue-200 focus:border-blue-600 focus:bg-blue-50 outline-none px-1.5 py-1 rounded transition-colors print:border-none print:p-0" />
                                            <div className="text-[11px] text-gray-500 text-right px-1.5">{(it.quantity * it.rate * it.cess / 100).toFixed(2)}</div>
                                        </td>
                                        <td className={`p-2 align-top text-right font-semibold whitespace-nowrap pt-3 ${template === 't-spreadsheet' ? 'border border-gray-300' : ''}`}>
                                            {(it.quantity * it.rate).toFixed(2)}
                                        </td>
                                        <td className={`p-1 align-top text-center no-print ${template === 't-spreadsheet' ? 'border border-gray-300' : ''}`}>
                                            <button onClick={() => removeItem(it.id)} className="text-red-500 hover:bg-red-100 p-1 rounded transition-colors" title="Remove">
                                                <X size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <button onClick={addItem} className="no-print my-3 bg-blue-50 text-blue-600 border border-blue-600/25 rounded-md px-3.5 py-2 font-semibold text-xs flex items-center gap-1 hover:bg-blue-100 transition-colors">
                            <Plus size={14} /> Add New Line
                        </button>

                        {/* Bottom Section */}
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6 mt-2">
                            <div>
                                <div className="font-bold text-[13px] mb-1">Notes</div>
                                <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full min-h-[54px] resize-y border border-transparent hover:border-blue-200 focus:border-blue-600 focus:bg-blue-50 outline-none px-1.5 py-1 rounded transition-colors print:border-none print:p-0" />

                                <div className="font-bold text-[13px] mb-1 mt-3">Terms & Conditions</div>
                                <textarea value={terms} onChange={e => setTerms(e.target.value)} className="w-full min-h-[54px] resize-y border border-transparent hover:border-blue-200 focus:border-blue-600 focus:bg-blue-50 outline-none px-1.5 py-1 rounded transition-colors print:border-none print:p-0" />
                            </div>

                            <div>
                                <div className="grid gap-1.5 content-start">
                                    <div className="flex justify-between px-1.5 py-0.5 text-gray-600"><span>Sub Total</span><span>{fmt(subtotal)}</span></div>
                                    <div className="flex justify-between px-1.5 py-0.5 text-gray-600"><span>SGST</span><span>{fmt(totalSgst)}</span></div>
                                    <div className="flex justify-between px-1.5 py-0.5 text-gray-600"><span>CGST</span><span>{fmt(totalCgst)}</span></div>
                                    <div className="flex justify-between px-1.5 py-0.5 text-gray-600"><span>Cess</span><span>{fmt(totalCcess)}</span></div>
                                    <div className="flex justify-between px-1.5 py-2.5 mt-1 border-t-2 text-[17px] font-extrabold text-gray-900" style={{ borderColor: theme }}>
                                        <span>Total</span><span>{fmt(grandTotal)}</span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-600 italic px-1.5 mt-2">Total in words: {numToWords(grandTotal)}</p>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <div className="w-[220px] border-t border-gray-400 text-center pt-1 text-gray-500 text-xs">
                                Authorized Signature
                            </div>
                        </div>

                    </div>
                </div>

                {/* Sidebar */}
                <aside className="w-full lg:w-[290px] bg-white border border-[#E5E7EB] rounded-xl shadow-sm p-5 sticky top-[80px] flex flex-col gap-4 no-print shrink-0">
                    <h3 className="m-0 text-base font-bold pb-3 border-b border-[#E5E7EB]">Download Invoice</h3>

                    <div className="flex items-center gap-2.5 text-[13px] font-semibold pb-3.5 border-b border-[#E5E7EB]">
                        Theme
                        <div className="flex gap-2.5 ml-1">
                            {['#111111', '#E8711A', '#1E40AF', '#0F9D8A', '#C62828'].map(c => (
                                <button
                                    key={c}
                                    onClick={() => setTheme(c)}
                                    className={`w-5 h-5 rounded-full border-2 border-white transition-all outline outline-2 ${theme === c ? 'scale-110' : 'outline-transparent'}`}
                                    style={{ backgroundColor: c, outlineColor: theme === c ? c : 'transparent' }}
                                    title={c}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { id: 't-standard', label: 'Standard', ui: <div className="h-[78px] border-2 border-[#E5E7EB] rounded-md bg-blue-50/50 mb-1.5 p-2 flex flex-col justify-end gap-1"><div className="h-2 rounded-sm opacity-80" style={{ backgroundColor: theme }}></div><div className="h-4 border border-gray-400 opacity-50 bg-transparent rounded-sm"></div></div> },
                            { id: 't-spreadsheet', label: 'Spreadsheet', ui: <div className="h-[78px] border-2 border-[#E5E7EB] rounded-md bg-blue-50/50 mb-1.5 p-2 flex flex-col justify-end gap-1"><div className="h-4 border border-gray-400 opacity-50 bg-transparent rounded-sm"></div><div className="h-4 border border-gray-400 opacity-50 bg-transparent rounded-sm"></div></div> },
                            { id: 't-compact', label: 'Compact', ui: <div className="h-[78px] border-2 border-[#E5E7EB] rounded-md bg-blue-50/50 mb-1.5 p-2 flex flex-col justify-end gap-1"><div className="h-2 rounded-sm opacity-80" style={{ backgroundColor: theme }}></div><div className="h-2 rounded-sm opacity-80" style={{ backgroundColor: theme }}></div></div> }
                        ].map(tpl => (
                            <div
                                key={tpl.id}
                                onClick={() => setTemplate(tpl.id)}
                                className={`text-center text-xs font-medium cursor-pointer transition-colors ${template === tpl.id ? 'text-blue-600 font-bold' : 'text-gray-500'}`}
                            >
                                <div className={`transition-colors [&>div]:border-2 ${template === tpl.id ? '[&>div]:border-blue-600' : ''}`}>
                                    {tpl.ui}
                                </div>
                                {tpl.label}
                            </div>
                        ))}
                    </div>

                    <button onClick={() => saveDraft(false)} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 font-bold text-sm shadow-md transition-all active:translate-y-px">
                        Save Invoice
                    </button>

                    <button onClick={handlePrint} className="w-full bg-white hover:bg-gray-50 text-gray-600 border border-gray-300 rounded-lg py-2.5 font-bold text-sm transition-colors">
                        Download / Print PDF
                    </button>

                    <button onClick={reset} className="w-full bg-white hover:bg-gray-50 text-gray-600 border border-gray-300 rounded-lg py-2.5 font-bold text-sm transition-colors">
                        Reset
                    </button>
                </aside>

            </div>

            {/* Toast */}
            <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg text-[13px] font-semibold z-[99] transition-all duration-300 no-print ${toastMsg ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
                {toastMsg}
            </div>

        </div>
    );
}

