"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiOutlineArrowLeft, HiOutlineShieldCheck, HiOutlineInformationCircle, HiOutlineUsers } from "react-icons/hi";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { 
  adminRolesService, 
  AdminRoleItem, 
  PermissionLevel, 
  INITIAL_ROLES_DATA 
} from "@/services/admin/roles.service";

interface EditRoleMatrixViewProps {
  roleId: string;
}

interface ModuleRowState {
  moduleName: string;
  level: PermissionLevel;
}

const ALL_MODULES = [
  "User Management",
  "Project Management",
  "Marketplace Management",
  "Legal Agreements",
  "Payments & Escrow",
  "Dispute Resolution",
  "Verification",
  "Subscriptions",
  "Support",
  "Platform Settings",
  "Audit Logs"
];

export const EditRoleMatrixView: React.FC<EditRoleMatrixViewProps> = ({ roleId }) => {
  const router = useRouter();
  const [role, setRole] = useState<AdminRoleItem | null>(null);
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initial matrix state
  const [matrix, setMatrix] = useState<ModuleRowState[]>(
    ALL_MODULES.map((m) => ({
      moduleName: m,
      level: roleId.includes("super") || roleId.includes("SUPER") ? "Full Access" : "Manage",
    }))
  );

  useEffect(() => {
    const fetchRole = async () => {
      const allRoles = await adminRolesService.getRoles();
      const match = allRoles.find((r) => r.id === roleId || r.roleKey.toLowerCase() === roleId.toLowerCase()) || INITIAL_ROLES_DATA[0];
      if (match) {
        setRole(match);
        setRoleName(match.name);
        setDescription(match.description);
        setStatus(match.status);
      }
    };

    fetchRole();
  }, [roleId]);

  const breadcrumbItems = [
    { label: "Admin Portal", href: "/admin/dashboard" },
    { label: "Admin Roles", href: "/admin/roles" },
    { label: "Edit Role" },
  ];

  const handleLevelChange = (moduleName: string, level: PermissionLevel) => {
    setMatrix((prev) =>
      prev.map((row) =>
        row.moduleName === moduleName ? { ...row, level } : row
      )
    );
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => {
        router.push("/admin/roles");
      }, 1000);
    }, 600);
  };

  return (
    <div className="w-full flex flex-col gap-6 pb-12 animate-in fade-in duration-300">
      {/* Top Navigation & Back Button */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Link
            href="/admin/roles"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-semibold transition-all cursor-pointer"
          >
            <HiOutlineArrowLeft size={15} />
            <span>Back to Roles</span>
          </Link>
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Edit Role: {roleName || "Super Admin"}
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Adjust the permissions assigned to this role. Changes take effect immediately after saving.
          </p>
        </div>
      </div>

      {/* Success Notification Alert */}
      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-semibold flex items-center justify-between animate-in fade-in">
          <span>Permissions saved successfully! Redirecting to Roles overview...</span>
        </div>
      )}

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Matrix Table Column (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-6 bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 shadow-sm">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-white/10 text-[11px] font-bold uppercase tracking-wider text-white/40">
                  <th className="py-3 px-4">MODULE</th>
                  <th className="py-3 px-4 text-center">View-Only</th>
                  <th className="py-3 px-4 text-center">Manage</th>
                  <th className="py-3 px-4 text-center">Full Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {matrix.map((row) => (
                  <tr key={row.moduleName} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4 text-sm font-semibold text-white/90">
                      {row.moduleName}
                    </td>

                    {/* View-Only Option */}
                    <td className="py-4 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleLevelChange(row.moduleName, "View-Only")}
                        className={`w-6 h-6 rounded-lg border inline-flex items-center justify-center transition-all cursor-pointer ${
                          row.level === "View-Only"
                            ? "bg-purple-600/30 border-purple-500 text-purple-300"
                            : "border-white/20 hover:border-white/40"
                        }`}
                      >
                        {row.level === "View-Only" && <span className="text-xs font-bold">✓</span>}
                      </button>
                    </td>

                    {/* Manage Option */}
                    <td className="py-4 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleLevelChange(row.moduleName, "Manage")}
                        className={`w-6 h-6 rounded-lg border inline-flex items-center justify-center transition-all cursor-pointer ${
                          row.level === "Manage"
                            ? "bg-purple-600/30 border-purple-500 text-purple-300"
                            : "border-white/20 hover:border-white/40"
                        }`}
                      >
                        {row.level === "Manage" && <span className="text-xs font-bold">✓</span>}
                      </button>
                    </td>

                    {/* Full Access Option */}
                    <td className="py-4 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleLevelChange(row.moduleName, "Full Access")}
                        className={`w-6 h-6 rounded-lg border inline-flex items-center justify-center transition-all cursor-pointer ${
                          row.level === "Full Access"
                            ? "bg-purple-600/30 border-purple-500 text-purple-300"
                            : "border-white/20 hover:border-white/40"
                        }`}
                      >
                        {row.level === "Full Access" && <span className="text-xs font-bold">✓</span>}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-[#72c043] text-[#0d0f10] font-bold text-sm hover:brightness-110 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSaving ? "Saving Permissions..." : "Save Permissions"}
            </button>
            <Link
              href="/admin/roles"
              className="px-6 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-semibold text-sm transition-all cursor-pointer"
            >
              Cancel
            </Link>
          </div>
        </div>

        {/* Right Sidebar Column (1/3 width) */}
        <div className="flex flex-col gap-6">
          {/* ROLE DETAILS Box */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 space-y-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/40">
              Role Details
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/70">Role Name</label>
              <input
                type="text"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-green/50 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/70">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-green/50 transition-all resize-none"
              />
            </div>

            {/* Mini Stats */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <span className="text-lg font-bold text-white block">{role?.permissionsCount || 11}</span>
                <span className="text-[10px] text-white/40 font-medium uppercase tracking-wider block mt-0.5">Permissions</span>
              </div>
              <div 
                onClick={() => router.push("/admin/roles/accounts")}
                className="bg-white/5 border border-white/10 rounded-xl p-3 text-center cursor-pointer hover:bg-white/10 transition-all"
              >
                <span className="text-lg font-bold text-white block">{role?.adminsCount || 2}</span>
                <span className="text-[10px] text-white/40 font-medium uppercase tracking-wider block mt-0.5">Admins</span>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-xs font-semibold text-white/70">Status</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                status === "Active" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-white/10 text-white/50 border border-white/10"
              }`}>
                {status}
              </span>
            </div>
          </div>

          {/* PERMISSION LEVELS Legend Box */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/40">
              Permission Levels
            </h3>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</div>
                <div>
                  <span className="text-xs font-bold text-white block">View-Only</span>
                  <span className="text-[11px] text-white/40">Read access only</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</div>
                <div>
                  <span className="text-xs font-bold text-white block">Manage</span>
                  <span className="text-[11px] text-white/40">Read + write access</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</div>
                <div>
                  <span className="text-xs font-bold text-white block">Full Access</span>
                  <span className="text-[11px] text-white/40">All actions incl. delete</span>
                </div>
              </div>
            </div>
          </div>

          {/* Audit Log Warning Callout */}
          <Link
            href="/admin/roles/access-history"
            className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/20 flex items-start gap-3 text-blue-300 text-xs hover:bg-blue-950/50 hover:border-blue-500/30 transition-all cursor-pointer"
          >
            <HiOutlineInformationCircle size={18} className="shrink-0 text-blue-400 mt-0.5" />
            <span className="leading-relaxed">
              All permission changes are recorded in the Audit Log and take effect immediately after saving.
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EditRoleMatrixView;
