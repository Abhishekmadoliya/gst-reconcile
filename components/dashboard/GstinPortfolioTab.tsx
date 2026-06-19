"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { API_URL } from "@/lib/config";
import {
  Building2,
  Plus,
  Trash2,
  Link2,
  Link2Off,
  Loader2,
  AlertCircle,
  X,
  CheckCircle2,
  ShieldCheck,
  Send
} from "lucide-react";

interface Gstin {
  id: string;
  gstin: string;
  legalName: string | null;
  tradeName: string | null;
  status: "pending" | "connected" | "expired" | "error";
  createdAt: string;
}

export default function GstinPortfolioTab() {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [gstinInput, setGstinInput] = useState("");
  const [legalName, setLegalName] = useState("");
  const [tradeName, setTradeName] = useState("");
  
  // Connection Flow State
  const [connectingGstin, setConnectingGstin] = useState<Gstin | null>(null);
  const [gspUsername, setGspUsername] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpRequestId, setOtpRequestId] = useState("");
  const [otpCode, setOtpCode] = useState("");
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // 1. Fetch GSTIN list
  const { data: gstinsRes, isLoading } = useQuery({
    queryKey: ["gstins"],
    queryFn: async () => {
      const res = await api.get(`${API_URL}/api/gstins`);
      return res.data;
    },
  });

  const gstins: Gstin[] = gstinsRes?.data || [];

  // 2. Add GSTIN Mutation
  const addGstinMutation = useMutation({
    mutationFn: async (newGstin: { gstin: string; legalName?: string; tradeName?: string }) => {
      const res = await api.post(`${API_URL}/api/gstins`, newGstin);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["gstins"] });
      setSuccessMsg(`GSTIN ${data.data.gstin} added successfully.`);
      setErrorMsg(null);
      setGstinInput("");
      setLegalName("");
      setTradeName("");
      setShowAddForm(false);
    },
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.error?.message || "Failed to add GSTIN. Double check limit constraints.");
      setSuccessMsg(null);
    },
  });

  // 3. Delete GSTIN Mutation
  const deleteGstinMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`${API_URL}/api/gstins/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gstins"] });
      setSuccessMsg("GSTIN removed from portfolio.");
      setErrorMsg(null);
    },
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.error?.message || "Failed to delete GSTIN.");
      setSuccessMsg(null);
    },
  });

  // 4. Request GSP OTP Mutation
  const requestOtpMutation = useMutation({
    mutationFn: async ({ id, username }: { id: string; username: string }) => {
      const res = await api.post(`${API_URL}/api/gstins/${id}/connect`, { username });
      return res.data;
    },
    onSuccess: (data) => {
      setOtpSent(true);
      setOtpRequestId(data.data.requestId);
      setSuccessMsg("OTP dispatched to the tax officer's registered mobile number.");
      setErrorMsg(null);
    },
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.error?.message || "Failed to dispatch GSP OTP. Verify Username.");
      setSuccessMsg(null);
    },
  });

  // 5. Verify GSP OTP Mutation
  const verifyOtpMutation = useMutation({
    mutationFn: async ({ id, otp, requestId }: { id: string; otp: string; requestId: string }) => {
      const res = await api.post(`${API_URL}/api/gstins/${id}/verify-otp`, { otp, requestId });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gstins"] });
      setSuccessMsg("GSP credentials verified. GSTIN connected successfully.");
      setErrorMsg(null);
      closeConnectModal();
    },
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.error?.message || "Invalid OTP. Verification failed.");
      setSuccessMsg(null);
    },
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanGstin = gstinInput.trim().toUpperCase();
    if (!/^[0-9A-Z]{15}$/.test(cleanGstin)) {
      setErrorMsg("Invalid GSTIN format. Must be 15 alphanumeric characters.");
      return;
    }

    addGstinMutation.mutate({
      gstin: cleanGstin,
      legalName: legalName.trim() || undefined,
      tradeName: tradeName.trim() || undefined,
    });
  };

  const startConnectFlow = (gstin: Gstin) => {
    setConnectingGstin(gstin);
    setGspUsername("");
    setOtpSent(false);
    setOtpRequestId("");
    setOtpCode("");
    setErrorMsg(null);
  };

  const closeConnectModal = () => {
    setConnectingGstin(null);
    setOtpSent(false);
    setOtpRequestId("");
    setOtpCode("");
  };

  const handleConnectRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectingGstin) return;
    setErrorMsg(null);
    requestOtpMutation.mutate({
      id: connectingGstin.id,
      username: gspUsername.trim(),
    });
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectingGstin || !otpRequestId) return;
    setErrorMsg(null);
    verifyOtpMutation.mutate({
      id: connectingGstin.id,
      otp: otpCode.trim(),
      requestId: otpRequestId,
    });
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 bg-card border border-border rounded-xl shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-foreground">
            GSTIN Portfolio Manager
          </h2>
          <p className="text-[11px] text-muted-foreground">
            Manage your firm's client GSTIN numbers and GSP access credentials.
          </p>
        </div>
        {!showAddForm && (
          <button
            onClick={() => {
              setShowAddForm(true);
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className="flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-bold py-2 px-4 rounded-lg shadow cursor-pointer transition-colors"
          >
            <Plus className="h-4 w-4" /> Add GSTIN
          </button>
        )}
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-3 rounded-lg border border-alert/20 bg-alert-bg text-alert text-xs flex items-start gap-2 leading-relaxed">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 rounded-lg border border-success/20 bg-compliance-success-bg text-success text-xs flex items-start gap-2 leading-relaxed">
          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Add GSTIN Form Drawer/Panel */}
      {showAddForm && (
        <div className="p-6 bg-card border border-border rounded-xl shadow-sm relative animate-in fade-in slide-in-from-top-4 duration-200">
          <button
            onClick={() => setShowAddForm(false)}
            className="absolute right-4 top-4 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
            Add Client GSTIN
          </h3>
          <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                GSTIN (15 Alphanumeric)
              </label>
              <input
                type="text"
                placeholder="27AAAAA0000A1Z1"
                value={gstinInput}
                onChange={(e) => setGstinInput(e.target.value.toUpperCase())}
                disabled={addGstinMutation.isPending}
                className="w-full px-3 py-2 border border-border bg-background text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-mono"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Legal Name (Optional)
              </label>
              <input
                type="text"
                placeholder="ABC Enterprise Pvt Ltd"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                disabled={addGstinMutation.isPending}
                className="w-full px-3 py-2 border border-border bg-background text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Trade Name (Optional)
              </label>
              <input
                type="text"
                placeholder="ABC Stores"
                value={tradeName}
                onChange={(e) => setTradeName(e.target.value)}
                disabled={addGstinMutation.isPending}
                className="w-full px-3 py-2 border border-border bg-background text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
              />
            </div>
            <div className="md:col-span-3 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-border hover:bg-muted text-xs font-semibold rounded-md transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={addGstinMutation.isPending}
                className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold py-2 px-4 rounded-md shadow transition-colors cursor-pointer disabled:opacity-50"
              >
                {addGstinMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Adding...
                  </>
                ) : (
                  "Add GSTIN"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* GSTIN Portfolio Table */}
      {isLoading ? (
        <div className="p-8 text-center bg-card border border-border rounded-xl">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground mb-2" />
          <p className="text-xs text-muted-foreground">Loading GSTIN portfolio...</p>
        </div>
      ) : gstins.length === 0 ? (
        <div className="p-10 text-center border border-dashed border-border rounded-xl bg-card">
          <Building2 className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-xs font-bold text-foreground">No GSTIN registered yet</p>
          <p className="text-[10px] text-muted-foreground mt-1 mb-4">
            Get started by adding a client GSTIN to your portfolio.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-bold py-2 px-4 rounded-lg shadow cursor-pointer transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Your First GSTIN
          </button>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="p-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Company / Trade Name</th>
                  <th className="p-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-mono">GSTIN</th>
                  <th className="p-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">GSP Status</th>
                  <th className="p-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {gstins.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-foreground">
                          {item.tradeName || item.legalName || "Unnamed Business"}
                        </span>
                        {(item.tradeName && item.legalName) && (
                          <span className="text-[9px] text-muted-foreground mt-0.5">
                            Legal: {item.legalName}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-mono text-xs font-semibold text-foreground tracking-wide">
                      {item.gstin}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                        item.status === "connected"
                          ? "bg-compliance-success-bg text-compliance-success border-compliance-success/20"
                          : item.status === "expired"
                          ? "bg-compliance-warn-bg text-compliance-warn border-compliance-warn/20"
                          : item.status === "error"
                          ? "bg-compliance-alert-bg text-compliance-alert border-compliance-alert/20"
                          : "bg-muted text-muted-foreground border-border"
                      }`}>
                        {item.status === "connected" ? (
                          <>
                            <ShieldCheck className="h-3 w-3" /> Connected
                          </>
                        ) : (
                          item.status
                        )}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {item.status !== "connected" ? (
                          <button
                            onClick={() => startConnectFlow(item)}
                            className="flex items-center gap-1 bg-background border border-border hover:bg-accent text-primary text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded shadow-sm transition-colors cursor-pointer"
                          >
                            <Link2 className="h-3.5 w-3.5 shrink-0" /> Link GSP
                          </button>
                        ) : (
                          <button
                            disabled
                            className="flex items-center gap-1 bg-muted text-muted-foreground text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded border border-border cursor-not-allowed"
                          >
                            <Link2Off className="h-3.5 w-3.5 shrink-0" /> Linked
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (confirm(`Remove ${item.gstin} from portfolio?`)) {
                              deleteGstinMutation.mutate(item.id);
                            }
                          }}
                          disabled={deleteGstinMutation.isPending}
                          className="p-1.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* GSP Connection OTP Modal Overlay */}
      {connectingGstin && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-sm rounded-xl p-6 shadow-xl relative animate-in zoom-in-95 duration-200 text-left">
            <button
              onClick={closeConnectModal}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-1.5">
              <Building2 className="h-5 w-5 text-primary" /> Connect Sandbox GSP
            </h3>
            <p className="text-[11px] text-muted-foreground mb-4">
              Authorize API queries for <span className="font-mono font-bold text-foreground">{connectingGstin.gstin}</span> using secure OTP verification.
            </p>

            {/* Step 1: Request OTP username form */}
            {!otpSent ? (
              <form onSubmit={handleConnectRequest} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    GSTN portal username
                  </label>
                  <input
                    type="text"
                    placeholder="Enter GSTN username (e.g. abhishek_tax)"
                    value={gspUsername}
                    onChange={(e) => setGspUsername(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-border bg-background text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  />
                  <span className="text-[9px] text-muted-foreground block leading-tight mt-1">
                    *Username associated with this GSTIN on the government GST portal.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={requestOtpMutation.isPending}
                  className="w-full flex items-center justify-center gap-1.5 h-10 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-md shadow transition-colors cursor-pointer disabled:opacity-50"
                >
                  {requestOtpMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Dispatching OTP
                    </>
                  ) : (
                    <>
                      Send GSP OTP <Send className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Step 2: Verify OTP input */
              <form onSubmit={handleOtpVerify} className="space-y-4">
                <div className="p-3 rounded bg-muted/40 border border-border text-[10px] text-muted-foreground leading-normal mb-2">
                  An OTP has been dispatched to your GST registered mobile / email. Enter the 6-digit code below.
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    required
                    className="w-full tracking-[0.75em] text-center font-mono font-bold px-3 py-2.5 border border-border bg-background text-lg rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="flex-1 py-2 border border-border hover:bg-muted text-xs font-semibold rounded-md transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={verifyOtpMutation.isPending}
                    className="flex-1 flex items-center justify-center gap-1.5 h-10 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-md shadow transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {verifyOtpMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Verifying
                      </>
                    ) : (
                      "Connect Link"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
