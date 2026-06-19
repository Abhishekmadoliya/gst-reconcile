"use client";

import { useState } from "react";
import {
  Settings,
  Building,
  Users,
  Sliders,
  CheckCircle2,
  Plus,
  Trash2
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"firm" | "team" | "erp">("firm");
  const [invited, setInvited] = useState(false);
  const [presetsSaved, setPresetsSaved] = useState(false);

  const team = [
    { name: "Abhishek Sharma", email: "abhishek@cafirm.com", role: "Owner / Admin" },
    { name: "Sneha Patil", email: "sneha.patil@cafirm.com", role: "CA Associate" },
    { name: "Ramesh Kumar", email: "ramesh@cafirm.com", role: "Audit Assistant" },
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="p-5 bg-card border border-border rounded-sm flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Settings className="h-4.5 w-4.5 text-primary" /> Firm Settings Console
          </h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Configure CA firm profile details, manage assistant permissions, and customize default ERP upload column presets.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Settings Sub Tabs Left Menu */}
        <div className="w-full md:w-48 shrink-0 flex flex-row md:flex-col gap-1 border-b md:border-b-0 md:border-r border-border pb-4 md:pb-0 md:pr-4">
          <button
            onClick={() => setActiveTab("firm")}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-left w-full ${
              activeTab === "firm" ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/30"
            }`}
          >
            <Building className="h-4 w-4 shrink-0" />
            <span>Firm Profile</span>
          </button>
          <button
            onClick={() => setActiveTab("team")}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-left w-full ${
              activeTab === "team" ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/30"
            }`}
          >
            <Users className="h-4 w-4 shrink-0" />
            <span>Team Members</span>
          </button>
          <button
            onClick={() => setActiveTab("erp")}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-left w-full ${
              activeTab === "erp" ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/30"
            }`}
          >
            <Sliders className="h-4 w-4 shrink-0" />
            <span>ERP Preset Mappings</span>
          </button>
        </div>

        {/* Tab Canvas Area */}
        <div className="flex-1 bg-card border border-border rounded-sm p-5">
          {activeTab === "firm" && (
            <form onSubmit={(e) => { e.preventDefault(); alert("Firm profile settings updated."); }} className="space-y-4 max-w-md">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3 pb-2 border-b border-border/40">
                Firm Record Details
              </h3>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Firm Name</label>
                <input
                  type="text"
                  defaultValue="Sharma & Associates CA Firm"
                  required
                  className="w-full px-3 py-2 border border-border bg-background text-xs rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">CA Registration Number (CRN)</label>
                <input
                  type="text"
                  defaultValue="CA-829402"
                  className="w-full px-3 py-2 border border-border bg-background text-xs rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-primary hover:bg-primary/95 text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-sm shadow cursor-pointer transition-colors"
              >
                Save Profile
              </button>
            </form>
          )}

          {activeTab === "team" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-border/40">
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Invite Team Members
                </h3>
                <button
                  onClick={() => { setInvited(true); setTimeout(() => setInvited(false), 2000); }}
                  className="flex items-center gap-1 bg-primary hover:bg-primary/95 text-primary-foreground text-[9px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-sm shadow-sm cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Invite Auditor
                </button>
              </div>

              {invited && (
                <div className="p-3 bg-compliance-success-bg border border-success/15 rounded-sm text-[10px] text-success flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>Invitation email has been dispatched to recipient.</span>
                </div>
              )}

              <div className="divide-y divide-border/60">
                {team.map((member) => (
                  <div key={member.email} className="flex justify-between items-center py-2.5 text-xs">
                    <div>
                      <p className="font-bold text-foreground">{member.name}</p>
                      <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{member.email}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase">{member.role}</span>
                      <button
                        onClick={() => alert(`Remove member ${member.name}?`)}
                        className="p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded transition-colors cursor-pointer"
                        title="Remove member"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "erp" && (
            <form onSubmit={(e) => { e.preventDefault(); setPresetsSaved(true); setTimeout(() => setPresetsSaved(false), 2000); }} className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3 pb-2 border-b border-border/40">
                ERP Upload Presets Column Mappings
              </h3>

              {presetsSaved && (
                <div className="p-3 bg-compliance-success-bg border border-success/15 rounded-sm text-[10px] text-success flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>ERP preset mappings updated.</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Invoice ID Column Header</label>
                  <input
                    type="text"
                    defaultValue="Vch No. / Invoice No"
                    className="w-full px-3 py-2 border border-border bg-background text-xs rounded-md focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Supplier GSTIN Header</label>
                  <input
                    type="text"
                    defaultValue="Party GSTIN / Reg No"
                    className="w-full px-3 py-2 border border-border bg-background text-xs rounded-md focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Taxable Value Header</label>
                  <input
                    type="text"
                    defaultValue="Taxable Amount / Value"
                    className="w-full px-3 py-2 border border-border bg-background text-xs rounded-md focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">IGST Header</label>
                  <input
                    type="text"
                    defaultValue="IGST Amount"
                    className="w-full px-3 py-2 border border-border bg-background text-xs rounded-md focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-primary hover:bg-primary/95 text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-sm shadow cursor-pointer transition-colors"
              >
                Save Presets Mappings
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
