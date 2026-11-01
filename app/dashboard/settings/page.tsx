"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { API_URL } from "@/lib/config";
import {
  Settings,
  Building,
  Users,
  Sliders,
  CheckCircle2,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  Mail,
  ShieldCheck,
  UserPlus,
  FileSpreadsheet,
  Sparkles,
  Check,
} from "lucide-react";
import { ERP_PRESETS, getErpPresetById, type ErpPreset } from "@/lib/erp-presets";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface FirmData {
  id: string;
  name: string;
  plan: string;
  gstinLimit: number;
  billingCycle: string;
  billingStatus: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

/* ------------------------------------------------------------------ */
/*  Toast                                                              */
/* ------------------------------------------------------------------ */

type ToastVariant = "success" | "error";

function Toast({
  message,
  variant,
}: {
  message: string;
  variant: ToastVariant;
}) {
  const isSuccess = variant === "success";
  return (
    <div
      className={`p-3 border rounded-sm text-[10px] flex items-center gap-1.5 ${
        isSuccess
          ? "bg-compliance-success-bg border-success/15 text-success"
          : "bg-destructive/5 border-destructive/15 text-destructive"
      }`}
    >
      {isSuccess ? (
        <CheckCircle2 className="h-4 w-4 shrink-0" />
      ) : (
        <AlertCircle className="h-4 w-4 shrink-0" />
      )}
      <span>{message}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"firm" | "team" | "erp">("firm");
  const [presetsSaved, setPresetsSaved] = useState(false);

  return (
    <div className="space-y-6 text-left">
      <div className="p-5 bg-card border border-border rounded-sm flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Settings className="h-4.5 w-4.5 text-primary" /> Firm Settings
            Console
          </h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Configure CA firm profile details, manage assistant permissions, and
            customize default ERP upload column presets.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Settings Sub Tabs Left Menu */}
        <div className="w-full md:w-48 shrink-0 flex flex-row md:flex-col gap-1 border-b md:border-b-0 md:border-r border-border pb-4 md:pb-0 md:pr-4">
          {(
            [
              { key: "firm", label: "Firm Profile", icon: Building },
              { key: "team", label: "Team Members", icon: Users },
              { key: "erp", label: "ERP Preset Mappings", icon: Sliders },
            ] as const
          ).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-sm transition-colors cursor-pointer text-left w-full ${
                activeTab === key
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/30"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Tab Canvas Area */}
        <div className="flex-1 bg-card border border-border rounded-sm p-5">
          {activeTab === "firm" && <FirmProfileTab />}
          {activeTab === "team" && <TeamMembersTab />}
          {activeTab === "erp" && (
            <ErpPresetsTab
              presetsSaved={presetsSaved}
              setPresetsSaved={setPresetsSaved}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Firm Profile Tab                                                   */
/* ------------------------------------------------------------------ */

function FirmProfileTab() {
  const queryClient = useQueryClient();
  const [firmName, setFirmName] = useState("");
  const [nameInitialised, setNameInitialised] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    variant: ToastVariant;
  } | null>(null);

  const showToast = (message: string, variant: ToastVariant) => {
    setToast({ message, variant });
    setTimeout(() => setToast(null), 3000);
  };

  const {
    data: firm,
    isLoading,
    isError,
  } = useQuery<FirmData>({
    queryKey: ["settings", "firm"],
    queryFn: async () => {
      const res = await api.get(`${API_URL}/api/settings/firm`);
      return res.data.data;
    },
  });

  // Seed the input once firm data arrives
  if (firm && !nameInitialised) {
    setFirmName(firm.name);
    setNameInitialised(true);
  }

  const updateFirm = useMutation({
    mutationFn: async (name: string) => {
      const res = await api.patch(`${API_URL}/api/settings/firm`, { name });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "firm"] });
      showToast("Firm profile updated successfully.", "success");
    },
    onError: () => {
      showToast("Failed to update firm profile. Try again.", "error");
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 gap-2 text-muted-foreground text-xs">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="uppercase tracking-wider font-bold text-[10px]">
          Loading firm profile…
        </span>
      </div>
    );
  }

  if (isError || !firm) {
    return (
      <div className="flex items-center justify-center py-16 gap-2 text-destructive text-xs">
        <AlertCircle className="h-4 w-4" />
        <span className="uppercase tracking-wider font-bold text-[10px]">
          Failed to load firm profile.
        </span>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (firmName.trim()) updateFirm.mutate(firmName.trim());
      }}
      className="space-y-4 max-w-md"
    >
      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3 pb-2 border-b border-border/40">
        Firm Record Details
      </h3>

      {toast && <Toast message={toast.message} variant={toast.variant} />}

      {/* Firm Name */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Firm Name
        </label>
        <input
          type="text"
          value={firmName}
          onChange={(e) => setFirmName(e.target.value)}
          required
          className="w-full px-3 py-2 border border-border bg-background text-xs rounded-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
        />
      </div>

      {/* Plan Badge (read-only) */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Current Plan
        </label>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider rounded-sm border border-primary/20">
            <ShieldCheck className="h-3 w-3" />
            {firm.plan}
          </span>
        </div>
      </div>

      {/* GSTIN Limit (read-only) */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          GSTIN Limit
        </label>
        <p className="text-xs text-foreground font-mono">
          {firm.gstinLimit} GSTINs
        </p>
      </div>

      {/* Billing info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Billing Cycle
          </label>
          <p className="text-xs text-foreground font-mono capitalize">
            {firm.billingCycle}
          </p>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Billing Status
          </label>
          <p className="text-xs text-foreground font-mono capitalize">
            {firm.billingStatus}
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={updateFirm.isPending}
        className="px-4 py-2 bg-primary hover:bg-primary/95 text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-sm shadow cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
      >
        {updateFirm.isPending && (
          <Loader2 className="h-3 w-3 animate-spin" />
        )}
        Save Profile
      </button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  Team Members Tab                                                   */
/* ------------------------------------------------------------------ */

function TeamMembersTab() {
  const queryClient = useQueryClient();
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    variant: ToastVariant;
  } | null>(null);

  const showToast = (message: string, variant: ToastVariant) => {
    setToast({ message, variant });
    setTimeout(() => setToast(null), 3000);
  };

  const {
    data: team,
    isLoading,
    isError,
  } = useQuery<TeamMember[]>({
    queryKey: ["settings", "team"],
    queryFn: async () => {
      const res = await api.get(`${API_URL}/api/settings/team`);
      return res.data.data;
    },
  });

  const inviteMember = useMutation({
    mutationFn: async (body: { email: string; name: string }) => {
      const res = await api.post(
        `${API_URL}/api/settings/team/invite`,
        body,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "team"] });
      showToast("Invitation email has been dispatched to recipient.", "success");
      setInviteEmail("");
      setInviteName("");
      setShowInviteForm(false);
    },
    onError: () => {
      showToast("Failed to send invitation. Try again.", "error");
    },
  });

  const removeMember = useMutation({
    mutationFn: async (memberId: string) => {
      const res = await api.delete(
        `${API_URL}/api/settings/team/${memberId}`,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "team"] });
      showToast("Team member removed.", "success");
    },
    onError: () => {
      showToast("Failed to remove team member.", "error");
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 gap-2 text-muted-foreground text-xs">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="uppercase tracking-wider font-bold text-[10px]">
          Loading team members…
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-16 gap-2 text-destructive text-xs">
        <AlertCircle className="h-4 w-4" />
        <span className="uppercase tracking-wider font-bold text-[10px]">
          Failed to load team members.
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-border/40">
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
          Team Members
        </h3>
        <button
          onClick={() => setShowInviteForm((v) => !v)}
          className="flex items-center gap-1 bg-primary hover:bg-primary/95 text-primary-foreground text-[9px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-sm shadow-sm cursor-pointer transition-colors"
        >
          <UserPlus className="h-3.5 w-3.5" />
          Invite Member
        </button>
      </div>

      {toast && <Toast message={toast.message} variant={toast.variant} />}

      {/* Invite Form */}
      {showInviteForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (inviteEmail.trim() && inviteName.trim()) {
              inviteMember.mutate({
                email: inviteEmail.trim(),
                name: inviteName.trim(),
              });
            }
          }}
          className="p-4 border border-border/60 rounded-sm bg-muted/20 space-y-3"
        >
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" />
            Send Invitation
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Full Name
              </label>
              <input
                type="text"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                required
                placeholder="e.g. Sneha Patil"
                className="w-full px-3 py-2 border border-border bg-background text-xs rounded-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Email Address
              </label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
                placeholder="e.g. sneha@cafirm.com"
                className="w-full px-3 py-2 border border-border bg-background text-xs rounded-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-mono"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={inviteMember.isPending}
              className="px-4 py-2 bg-primary hover:bg-primary/95 text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-sm shadow cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              {inviteMember.isPending && (
                <Loader2 className="h-3 w-3 animate-spin" />
              )}
              Send Invite
            </button>
            <button
              type="button"
              onClick={() => setShowInviteForm(false)}
              className="px-4 py-2 bg-muted text-muted-foreground text-[10px] font-bold uppercase tracking-wider rounded-sm cursor-pointer transition-colors hover:bg-muted/70"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Team Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-2 pr-4">
                Name
              </th>
              <th className="text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-2 pr-4">
                Email
              </th>
              <th className="text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-2 pr-4">
                Role
              </th>
              <th className="text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-2 pr-4">
                Joined
              </th>
              <th className="text-right text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-2">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {team && team.length > 0 ? (
              team.map((member) => {
                const isOwner =
                  member.role.toLowerCase() === "owner" ||
                  member.role.toLowerCase() === "admin";
                return (
                  <tr key={member.id}>
                    <td className="py-2.5 pr-4">
                      <p className="font-bold text-foreground">
                        {member.name}
                      </p>
                    </td>
                    <td className="py-2.5 pr-4">
                      <p className="text-[10px] text-muted-foreground font-mono">
                        {member.email}
                      </p>
                    </td>
                    <td className="py-2.5 pr-4">
                      {isOwner ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider rounded-sm border border-primary/20">
                          <ShieldCheck className="h-3 w-3" />
                          {member.role}
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground font-semibold uppercase">
                          {member.role}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 pr-4">
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {new Date(member.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      {!isOwner && (
                        <button
                          onClick={() => removeMember.mutate(member.id)}
                          disabled={removeMember.isPending}
                          className="p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-sm transition-colors cursor-pointer disabled:opacity-50"
                          title="Remove member"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="py-8 text-center text-[10px] text-muted-foreground uppercase tracking-wider font-bold"
                >
                  No team members found. Invite your first member above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ERP Presets Tab (Intelligent ERP Mapping Manager)                 */
/* ------------------------------------------------------------------ */

function ErpPresetsTab({
  presetsSaved,
  setPresetsSaved,
}: {
  presetsSaved: boolean;
  setPresetsSaved: (v: boolean) => void;
}) {
  const [selectedPresetId, setSelectedPresetId] = useState<string>("tally");
  const selectedPreset = getErpPresetById(selectedPresetId);

  const [mappings, setMappings] = useState<Record<string, string>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("taxsolver_custom_erp_mapping");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return { ...selectedPreset.mappings };
  });

  const handleSelectPreset = (id: string) => {
    setSelectedPresetId(id);
    const preset = getErpPresetById(id);
    setMappings({ ...preset.mappings });
  };

  const handleFieldChange = (key: string, val: string) => {
    setMappings((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("taxsolver_custom_erp_mapping", JSON.stringify(mappings));
      localStorage.setItem("taxsolver_selected_erp_preset", selectedPresetId);
    }
    setPresetsSaved(true);
    setTimeout(() => setPresetsSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/40">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
            ERP Upload Presets & Column Normalization
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Configure default header presets for your firm's primary accounting software (Tally, Zoho, Marg, Busy, SAP).
          </p>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-primary hover:bg-primary/95 text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-sm shadow cursor-pointer transition-colors self-start sm:self-auto shrink-0"
        >
          Save Preset Mappings
        </button>
      </div>

      {presetsSaved && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-sm text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span className="font-bold">ERP preset mappings updated and saved to firm workspace.</span>
        </div>
      )}

      {/* Preset Selector Grid */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Select Standard Accounting ERP
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {ERP_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                type="button"
                key={preset.id}
                onClick={() => handleSelectPreset(preset.id)}
                className={`p-3 text-left border rounded-sm transition-all cursor-pointer relative ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-xs"
                    : "border-border bg-card hover:bg-muted/30"
                }`}
              >
                {preset.badge && (
                  <span className="absolute top-2 right-2 text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-sm bg-primary/10 text-primary border border-primary/20">
                    {preset.badge}
                  </span>
                )}
                <div className="flex items-center gap-1.5">
                  <FileSpreadsheet className={`h-4 w-4 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="text-xs font-bold text-foreground">{preset.name}</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1">
                  {preset.tagline}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Preset Info Callout */}
      <div className="p-3.5 bg-muted/20 border border-border rounded-sm flex items-start gap-3">
        <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold text-foreground flex items-center gap-2">
            Active Profile: {selectedPreset.name}
            <span className="text-[9px] font-normal font-mono px-2 py-0.5 bg-muted rounded-xs text-muted-foreground">
              Format: {selectedPreset.exportFormat}
            </span>
          </p>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {selectedPreset.description}
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[9px] font-bold uppercase text-muted-foreground">Expected Headers:</span>
            {selectedPreset.sampleColumns.map((col) => (
              <span key={col} className="text-[9px] font-mono bg-background border border-border px-1.5 py-0.5 rounded-xs text-foreground">
                {col}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Customizable Mapping Grid */}
      <div className="space-y-3">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-foreground">
          Canonical Header Mappings ({selectedPreset.name})
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Supplier GSTIN Column Header
            </label>
            <input
              type="text"
              value={mappings.supplierGstin || ""}
              onChange={(e) => handleFieldChange("supplierGstin", e.target.value)}
              className="w-full px-3 py-2 border border-border bg-background text-xs font-mono rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Supplier / Party Name Header
            </label>
            <input
              type="text"
              value={mappings.supplierName || ""}
              onChange={(e) => handleFieldChange("supplierName", e.target.value)}
              className="w-full px-3 py-2 border border-border bg-background text-xs font-mono rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Invoice / Voucher Number Header
            </label>
            <input
              type="text"
              value={mappings.invoiceNo || ""}
              onChange={(e) => handleFieldChange("invoiceNo", e.target.value)}
              className="w-full px-3 py-2 border border-border bg-background text-xs font-mono rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Invoice / Voucher Date Header
            </label>
            <input
              type="text"
              value={mappings.invoiceDate || ""}
              onChange={(e) => handleFieldChange("invoiceDate", e.target.value)}
              className="w-full px-3 py-2 border border-border bg-background text-xs font-mono rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Taxable Value / Base Amount Header
            </label>
            <input
              type="text"
              value={mappings.taxableValue || ""}
              onChange={(e) => handleFieldChange("taxableValue", e.target.value)}
              className="w-full px-3 py-2 border border-border bg-background text-xs font-mono rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Integrated Tax (IGST) Header
            </label>
            <input
              type="text"
              value={mappings.igst || ""}
              onChange={(e) => handleFieldChange("igst", e.target.value)}
              className="w-full px-3 py-2 border border-border bg-background text-xs font-mono rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Central Tax (CGST) Header
            </label>
            <input
              type="text"
              value={mappings.cgst || ""}
              onChange={(e) => handleFieldChange("cgst", e.target.value)}
              className="w-full px-3 py-2 border border-border bg-background text-xs font-mono rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              State / UT Tax (SGST) Header
            </label>
            <input
              type="text"
              value={mappings.sgst || ""}
              onChange={(e) => handleFieldChange("sgst", e.target.value)}
              className="w-full px-3 py-2 border border-border bg-background text-xs font-mono rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
