"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { API_URL } from "@/lib/config";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuthStore } from "@/store/useAuthStore";
import { useDashboardStore } from "@/store/useDashboardStore";
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
  Search,
  LogOut,
  TrendingUp,
  RefreshCw,
  Calendar,
  BarChart2,
  Mail,
  FileText,
  CreditCard,
  Settings,
  ChevronsUpDown
} from "lucide-react";

interface Gstin {
  id: string;
  gstin: string;
  legalName: string | null;
  tradeName: string | null;
  status: "pending" | "connected" | "expired" | "error";
  createdAt: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const { user, logout } = useAuthStore();
  const { selectedGstinId, setSelectedGstinId, selectedJobId, setSelectedJobId } = useDashboardStore();
  const pathname = usePathname();
  const router = useRouter();

  // Client Explorer search & Add client states
  const [clientSearch, setClientSearch] = useState("");
  const [showAddClient, setShowAddClient] = useState(false);
  const [newGstin, setNewGstin] = useState("");
  const [newLegalName, setNewLegalName] = useState("");
  const [newTradeName, setNewTradeName] = useState("");

  // OTP connection flow states
  const [connectingGstin, setConnectingGstin] = useState<Gstin | null>(null);
  const [gspUsername, setGspUsername] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpRequestId, setOtpRequestId] = useState("");
  const [otpCode, setOtpCode] = useState("");

  const [notification, setNotification] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [showClientDropdown, setShowClientDropdown] = useState(false);

  // 1. Fetch GSTIN list
  const { data: gstinsRes, isLoading: isGstinsLoading } = useQuery({
    queryKey: ["gstins"],
    queryFn: async () => {
      const res = await api.get(`${API_URL}/api/gstins`);
      return res.data;
    },
  });

  const gstins: Gstin[] = gstinsRes?.data || [];

  // Automatically select the first GSTIN when loaded if none is selected
  useEffect(() => {
    if (gstins.length > 0 && !selectedGstinId) {
      setSelectedGstinId(gstins[0].id);
    }
  }, [gstins, selectedGstinId, setSelectedGstinId]);

  // Find currently active client object
  const activeClient = gstins.find((g) => g.id === selectedGstinId) || null;

  // 2. Add GSTIN Mutation
  const addGstinMutation = useMutation({
    mutationFn: async (payload: { gstin: string; legalName?: string; tradeName?: string }) => {
      const res = await api.post(`${API_URL}/api/gstins`, payload);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["gstins"] });
      setNotification({ type: "success", msg: `Client GSTIN ${data.data.gstin} registered.` });
      setNewGstin("");
      setNewLegalName("");
      setNewTradeName("");
      setShowAddClient(false);
      setSelectedGstinId(data.data.id);
    },
    onError: (err: any) => {
      setNotification({
        type: "error",
        msg: err.response?.data?.error?.message || "Failed to add client. Check firm limits.",
      });
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
      setNotification({ type: "success", msg: "Client GSTIN deleted." });
      setSelectedGstinId(null);
    },
    onError: (err: any) => {
      setNotification({
        type: "error",
        msg: err.response?.data?.error?.message || "Failed to delete client.",
      });
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
      setNotification({ type: "success", msg: "OTP sent to GST registered phone." });
    },
    onError: (err: any) => {
      setNotification({
        type: "error",
        msg: err.response?.data?.error?.message || "Failed to send OTP. Confirm GSP username.",
      });
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
      setNotification({ type: "success", msg: "GSP connection verified and linked." });
      closeConnectModal();
    },
    onError: (err: any) => {
      setNotification({
        type: "error",
        msg: err.response?.data?.error?.message || "Incorrect verification OTP.",
      });
    },
  });

  // Action handlers
  const handleAddClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);
    const cleanGstin = newGstin.trim().toUpperCase();
    if (!/^[0-9A-Z]{15}$/.test(cleanGstin)) {
      setNotification({ type: "error", msg: "GSTIN format invalid. Must be 15 characters." });
      return;
    }
    addGstinMutation.mutate({
      gstin: cleanGstin,
      legalName: newLegalName.trim() || undefined,
      tradeName: newTradeName.trim() || undefined,
    });
  };

  const startConnectFlow = (gstin: Gstin) => {
    setConnectingGstin(gstin);
    setGspUsername("");
    setOtpSent(false);
    setOtpRequestId("");
    setOtpCode("");
    setNotification(null);
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
    setNotification(null);
    requestOtpMutation.mutate({
      id: connectingGstin.id,
      username: gspUsername.trim(),
    });
  };

  const handleOtpVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectingGstin || !otpRequestId) return;
    setNotification(null);
    verifyOtpMutation.mutate({
      id: connectingGstin.id,
      otp: otpCode.trim(),
      requestId: otpRequestId,
    });
  };

  // Filter client explorer list
  const filteredGstins = gstins.filter(
    (g) =>
      g.gstin.toLowerCase().includes(clientSearch.toLowerCase()) ||
      (g.tradeName || "").toLowerCase().includes(clientSearch.toLowerCase()) ||
      (g.legalName || "").toLowerCase().includes(clientSearch.toLowerCase())
  );

  const getStatusLedClass = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-compliance-success";
      case "expired":
      case "error":
        return "bg-compliance-warn animate-pulse";
      default:
        return "bg-muted-foreground/45";
    }
  };

  // Sidebar navigation setup
  const navItems = [
    { path: "/dashboard", label: "Overview", icon: TrendingUp },
    { path: "/dashboard/reconcile/new", label: "Run Autopilot", icon: RefreshCw },
    { path: "/dashboard/gstins", label: "GSTINs", icon: Building2 },
    { path: "/dashboard/history", label: "History", icon: Calendar },
    { path: "/dashboard/reports", label: "Reports", icon: BarChart2 },
    { path: "/dashboard/follow-ups", label: "Follow-ups", icon: Mail },
    { path: "/dashboard/gstr3b", label: "GSTR-3B", icon: FileText },
    { path: "/dashboard/billing", label: "Billing", icon: CreditCard },
    { path: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex flex-col bg-background min-h-screen text-foreground transition-colors duration-200">
      
      {/* GLOBAL TOP HEADER */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-30 shrink-0 select-none">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-mono font-semibold tracking-tight text-md text-foreground hover:opacity-95 transition-opacity">
            <span className="flex items-center justify-center bg-foreground text-background h-6.5 w-6.5 rounded font-sans font-bold text-xs">
              TS
            </span>
            <span className="hidden sm:inline">TaxSolver</span>
          </Link>
          
          {/* Breadcrumb / Active Client Display */}
          {activeClient ? (
            <div className="hidden md:flex items-center gap-2 font-mono text-[11px] border-l border-border pl-6 py-1">
              <span className="font-bold text-foreground">
                {activeClient.tradeName || activeClient.legalName || "Unnamed Business"}
              </span>
              <span className="text-muted-foreground text-[10px]">
                {activeClient.gstin}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-sans font-bold ${
                activeClient.status === "connected"
                  ? "bg-success-bg/10 text-success"
                  : "bg-warn-bg/10 text-warn"
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${getStatusLedClass(activeClient.status)}`} />
                {activeClient.status === "connected" ? "Linked" : "Offline"}
              </span>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2 text-xs border-l border-border pl-6 py-1 text-warn font-semibold">
              No Client Selected
            </div>
          )}
        </div>

        {/* Right Side Header Items */}
        <div className="flex items-center gap-4">
          {/* Dynamic Notification Badge */}
          {notification && (
            <div
              onClick={() => setNotification(null)}
              className={`py-1 px-3 border rounded-sm text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer max-w-[280px] truncate ${
                notification.type === "success"
                  ? "bg-compliance-success-bg text-compliance-success border-compliance-success/20"
                  : "bg-compliance-alert-bg text-compliance-alert border-compliance-alert/20"
              }`}
            >
              {notification.type === "success" ? (
                <CheckCircle2 className="h-3 w-3 shrink-0" />
              ) : (
                <AlertCircle className="h-3 w-3 shrink-0" />
              )}
              <span>{notification.msg}</span>
            </div>
          )}

          {/* Global GSP status indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 border border-border bg-muted/40 rounded-lg text-[9px] uppercase tracking-wider text-foreground/80 font-bold">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span>GSP: Sandbox.co.in</span>
          </div>

          <ThemeToggle />

          {/* User initials avatar */}
          <div className="flex items-center gap-2 border-l border-border pl-4">
            <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold font-sans">
              {user?.name ? user.name.split(" ").map((n: string) => n ? n[0] : "").join("").toUpperCase().substring(0, 2) : "CA"}
            </div>
          </div>
        </div>
      </header>

      {/* SUB-HEADER / WORKSPACE GRID */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT SIDEBAR */}
        <aside className="w-64 bg-card border-r border-border flex flex-col h-[calc(100vh-3.5rem)] sticky top-14 shrink-0 select-none text-left">
          
          {/* Client Switcher */}
          <div className="relative px-4 py-3 border-b border-border">
            <label className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground block mb-1">
              Active Client
            </label>
            <button
              onClick={() => setShowClientDropdown(!showClientDropdown)}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-card hover:bg-muted/50 border border-border rounded-lg text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`h-2 w-2 rounded-full shrink-0 ${
                    activeClient ? getStatusLedClass(activeClient.status) : "bg-muted-foreground/45"
                  }`}
                />
                <div className="truncate">
                  <p className="text-xs font-bold text-foreground truncate">
                    {activeClient ? (activeClient.tradeName || activeClient.legalName || "Unnamed Business") : "Select client..."}
                  </p>
                  {activeClient && (
                    <p className="text-[9px] font-mono text-muted-foreground tracking-wider mt-0.5">
                      {activeClient.gstin}
                    </p>
                  )}
                </div>
              </div>
              <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            </button>

            {/* Dropdown Menu */}
            {showClientDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowClientDropdown(false)}
                />
                <div className="absolute left-4 right-4 mt-1 bg-popover border border-border rounded-lg shadow-xl z-50 flex flex-col max-h-96 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                  {/* Search */}
                  <div className="p-2 border-b border-border relative">
                    <Search className="absolute left-4.5 top-3.5 h-3.5 w-3.5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search client..."
                      value={clientSearch}
                      onChange={(e) => setClientSearch(e.target.value)}
                      className="w-full pl-7.5 pr-2.5 py-1.5 border border-border bg-background text-[11px] rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                    />
                  </div>

                  {/* Client List */}
                  <div className="flex-1 overflow-y-auto divide-y divide-border/40 py-1 max-h-60">
                    {isGstinsLoading ? (
                      <div className="p-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading...
                      </div>
                    ) : filteredGstins.length === 0 ? (
                      <div className="p-4 text-center text-[10px] text-muted-foreground">
                        No clients found
                      </div>
                    ) : (
                      filteredGstins.map((client) => (
                        <div
                          key={client.id}
                          className={`w-full flex items-center justify-between gap-2 p-2.5 hover:bg-muted/50 transition-colors ${
                            client.id === selectedGstinId ? "bg-muted font-semibold" : ""
                          }`}
                        >
                          <button
                            onClick={() => {
                              setSelectedGstinId(client.id);
                              setSelectedJobId(null);
                              setShowClientDropdown(false);
                            }}
                            className="flex-1 text-left min-w-0 cursor-pointer focus:outline-none"
                          >
                            <p className="text-xs font-bold text-foreground truncate">
                              {client.tradeName || client.legalName || "Unnamed Business"}
                            </p>
                            <p className="text-[9px] font-mono text-muted-foreground tracking-wider mt-0.5">
                              {client.gstin}
                            </p>
                          </button>
                          
                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${getStatusLedClass(client.status)}`}
                            />
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`Are you sure you want to delete client ${client.tradeName || client.legalName || client.gstin}?`)) {
                                  deleteGstinMutation.mutate(client.id);
                                }
                              }}
                              className="p-1 hover:bg-destructive/15 text-muted-foreground hover:text-destructive rounded transition-colors cursor-pointer"
                              title="Delete client"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add client button */}
                  <div className="p-2 border-t border-border bg-muted/20">
                    <button
                      onClick={() => {
                        setShowAddClient(true);
                        setShowClientDropdown(false);
                      }}
                      className="w-full py-1.5 px-3 bg-primary text-primary-foreground hover:bg-primary/95 text-[10px] font-bold uppercase tracking-wider rounded-md shadow transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Register Client
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Navigation links */}
          <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
            {navItems.map((tab) => {
              const isActive = pathname === tab.path;
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.path}
                  href={tab.path}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? "bg-primary text-primary-foreground font-bold shadow-sm"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                  <span>{tab.label}</span>
                </Link>
              );
            })}

            {/* Dynamic results viewer tab */}
            {selectedJobId && (
              <Link
                href={`/dashboard/reconcile/${selectedJobId}`}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  pathname.startsWith("/dashboard/reconcile/") && pathname !== "/dashboard/reconcile/new"
                    ? "bg-info text-info-foreground font-bold shadow-sm"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <FileText className="h-4 w-4 shrink-0 text-inherit" />
                <span>Results Ledger</span>
              </Link>
            )}
          </nav>

          {/* Active Client GSP warning card if offline */}
          {activeClient && activeClient.status === "connected" && (
            <div className="mx-4 mb-4 p-3 bg-success-bg/10 border border-success/20 rounded-lg">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-success" />
                <span className="text-[10px] font-bold text-success uppercase tracking-wider">
                  GSP Active
                </span>
              </div>
              <p className="text-[9px] text-muted-foreground mt-1.5 leading-normal">
                Secure handshake established. Realtime data ingestion enabled.
              </p>
            </div>
          )}

          {activeClient && activeClient.status !== "connected" && (
            <div className="mx-4 mb-4 p-3 bg-warn-bg/10 border border-warn/25 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-warn" />
                <span className="text-[10px] font-bold text-warn uppercase tracking-wider">
                  GSP Unlinked
                </span>
              </div>
              <p className="text-[9px] text-muted-foreground mt-1.5 leading-normal">
                GSTIN connection is offline. Autopilot sync requires a secure link.
              </p>
              <button
                onClick={() => startConnectFlow(activeClient)}
                className="w-full mt-2.5 py-1 px-2.5 bg-warn hover:bg-warn/95 text-white dark:text-background text-[9px] font-bold uppercase tracking-wider rounded flex items-center justify-center gap-1 cursor-pointer transition-colors"
              >
                <Link2 className="h-3 w-3" />
                Link GSP Credentials
              </button>
            </div>
          )}

          {!activeClient && (
            <div className="mx-4 mb-4 p-3 bg-muted border border-border rounded-lg text-center">
              <p className="text-[10px] text-muted-foreground leading-normal">
                No client active. Select a client to begin audit.
              </p>
            </div>
          )}

          {/* Sidebar Footer with profile info and logout */}
          <div className="p-4 border-t border-border bg-muted/20 flex flex-col gap-2 mt-auto">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground truncate leading-none">
                  {user?.name || "CA Officer"}
                </p>
                <p className="text-[9px] text-muted-foreground truncate leading-none mt-1.5">
                  {user?.firmName || "CA Firm"}
                </p>
              </div>
              <button
                onClick={logout}
                className="p-1.5 hover:bg-destructive/15 text-muted-foreground hover:text-destructive rounded-lg transition-colors cursor-pointer border border-transparent hover:border-destructive/20"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN WORKSPACE CANVAS */}
        <main className="flex-1 overflow-y-auto bg-background transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-6 py-6 w-full">
            {children}
          </div>
        </main>

      </div>

      {/* Client Registration Modal Overlay */}
      {showAddClient && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-sm rounded-lg p-5 shadow-xl relative animate-in zoom-in-98 duration-200 text-left">
            <button
              onClick={() => {
                setShowAddClient(false);
                setNotification(null);
              }}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            <h3 className="text-xs font-extrabold uppercase tracking-wider text-foreground flex items-center gap-1.5 mb-1">
              <Building2 className="h-4 w-4 text-primary" /> Register Client GSTIN
            </h3>
            <p className="text-[10px] text-muted-foreground mb-4 leading-normal">
              Add a new business profile to your CA firm ledger.
            </p>

            <form onSubmit={handleAddClientSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[8px] font-extrabold uppercase tracking-widest text-muted-foreground">
                  GSTIN (15 Chars)
                </label>
                <input
                  type="text"
                  maxLength={15}
                  placeholder="27AAAAA0000A1Z1"
                  value={newGstin}
                  onChange={(e) => setNewGstin(e.target.value.toUpperCase())}
                  required
                  className="w-full px-2 py-1.5 border border-border bg-background text-[11px] font-mono rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-extrabold uppercase tracking-widest text-muted-foreground">
                  Trade Name / Legal Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Business Trade Name"
                  value={newTradeName}
                  onChange={(e) => setNewTradeName(e.target.value)}
                  className="w-full px-2 py-1.5 border border-border bg-background text-[11px] rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddClient(false)}
                  className="flex-1 py-1.5 border border-border hover:bg-accent text-[9px] font-bold uppercase rounded-md transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addGstinMutation.isPending}
                  className="flex-1 flex items-center justify-center gap-1 h-9 bg-primary text-primary-foreground hover:bg-primary/95 text-[9px] font-bold uppercase rounded-md shadow transition-colors cursor-pointer"
                >
                  {addGstinMutation.isPending ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    "Register"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GSP Connection OTP Modal Overlay (Sharp borders) */}
      {connectingGstin && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-sm rounded-lg p-5 shadow-xl relative animate-in zoom-in-98 duration-200 text-left">
            <button
              onClick={closeConnectModal}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            <h3 className="text-xs font-extrabold uppercase tracking-wider text-foreground flex items-center gap-1.5 mb-1">
              <Building2 className="h-4 w-4 text-primary" /> Link GSP credentials
            </h3>
            <p className="text-[10px] text-muted-foreground mb-4 leading-normal">
              Establish a secure GSP link for client <span className="font-mono font-bold text-foreground">[{connectingGstin.gstin}]</span>.
            </p>

            {/* Step 1: Request OTP username form */}
            {!otpSent ? (
              <form onSubmit={handleConnectRequest} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[8px] font-extrabold uppercase tracking-widest text-muted-foreground">
                    GSTN portal username
                  </label>
                  <input
                    type="text"
                    placeholder="Enter GSTN username"
                    value={gspUsername}
                    onChange={(e) => setGspUsername(e.target.value)}
                    required
                    className="w-full px-2 py-1.5 border border-border bg-background text-[11px] rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  />
                  <span className="text-[8px] text-muted-foreground block leading-tight mt-1">
                    *GSP Sandbox expects sandbox registered username credentials.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={requestOtpMutation.isPending}
                  className="w-full flex items-center justify-center gap-1 h-9 bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-bold rounded-md shadow transition-colors cursor-pointer disabled:opacity-50"
                >
                  {requestOtpMutation.isPending ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Dispatching OTP
                    </>
                  ) : (
                    "Send GSP OTP"
                  )}
                </button>
              </form>
            ) : (
              /* Step 2: Verify OTP input */
              <form onSubmit={handleOtpVerifySubmit} className="space-y-4">
                <div className="p-2.5 rounded-md bg-muted/40 border border-border text-[9px] text-muted-foreground leading-normal mb-2">
                  An OTP has been dispatched by GSP. Enter the 6-digit code.
                </div>
                
                <div className="space-y-1">
                  <label className="text-[8px] font-extrabold uppercase tracking-widest text-muted-foreground">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    required
                    className="w-full tracking-[0.5em] text-center font-mono font-bold px-2 py-2 border border-border bg-background text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="flex-1 py-1.5 border border-border hover:bg-accent text-[9px] font-bold uppercase rounded-md transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={verifyOtpMutation.isPending}
                    className="flex-1 flex items-center justify-center gap-1 h-9 bg-primary hover:bg-primary/95 text-primary-foreground text-[9px] font-bold uppercase tracking-wider rounded-md shadow transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {verifyOtpMutation.isPending ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Linking
                      </>
                    ) : (
                      "Verify Link"
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
