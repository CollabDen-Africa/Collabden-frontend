import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export interface AdminRoleItem {
  id: string;
  name: string;
  roleKey: string;
  status: "Active" | "Inactive";
  description: string;
  permissionsCount: number;
  adminsCount: number;
  themeColor: "green" | "blue" | "purple" | "yellow" | "gray";
  permissions: string[];
  modules: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RolesStats {
  totalRoles: number;
  totalAdmins: number;
  activeRoles: number;
  inactiveRoles: number;
}

export interface CreateRolePayload {
  name: string;
  description: string;
  status: "Active" | "Inactive";
  permissions: string[];
  modules: string[];
}

export type PermissionLevel = "None" | "View-Only" | "Manage" | "Full Access";

export interface ModulePermissionRow {
  moduleKey: string;
  moduleName: string;
  level: PermissionLevel;
}

export interface AdminAccountItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roleName: string;
  roleKey: string;
  status: "Active" | "Inactive";
  dateAdded: string;
  avatarUrl?: string;
  initials: string;
}

export interface InviteAdminPayload {
  firstName: string;
  lastName: string;
  email: string;
  roleKey: string;
  status: "Active" | "Inactive";
}

export interface AccessHistoryLog {
  id: string;
  adminName: string;
  initials: string;
  roleName: string;
  roleKey: string;
  timestamp: string;
  device: string;
  ipAddress: string;
  status: "Success" | "Failed" | "Locked";
  isSuspicious?: boolean;
}

export const INITIAL_ROLES_DATA: AdminRoleItem[] = [
  {
    id: "super-admin",
    name: "Super Admin",
    roleKey: "SUPER_ADMIN",
    status: "Active",
    description: "Full platform access. Manages all users, settings, and other admins.",
    permissionsCount: 11,
    adminsCount: 2,
    themeColor: "green",
    permissions: [
      "manage_users",
      "manage_admins",
      "manage_roles",
      "manage_settings",
      "manage_payments",
      "manage_moderation",
      "manage_agreements",
      "manage_projects",
      "manage_support",
      "view_audit_logs",
      "export_data"
    ],
    modules: [
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
    ]
  },
  {
    id: "support-admin",
    name: "Support Admin",
    roleKey: "SUPPORT_ADMIN",
    status: "Active",
    description: "Handles support tickets, user account issues, and escalations.",
    permissionsCount: 4,
    adminsCount: 6,
    themeColor: "blue",
    permissions: ["manage_support", "view_users", "manage_user_tickets", "send_notifications"],
    modules: ["Support", "User Management"]
  },
  {
    id: "finance-admin",
    name: "Finance Admin",
    roleKey: "FINANCE_ADMIN",
    status: "Active",
    description: "Monitors payments, escrow transactions, withdrawals, and financial reports.",
    permissionsCount: 5,
    adminsCount: 3,
    themeColor: "green",
    permissions: ["manage_payments", "manage_escrow", "process_withdrawals", "view_financial_reports", "refund_transactions"],
    modules: ["Payments & Escrow", "Legal Agreements"]
  },
  {
    id: "verification-admin",
    name: "Verification Admin",
    roleKey: "VERIFICATION_ADMIN",
    status: "Active",
    description: "Reviews identity documents and manages the verification queue.",
    permissionsCount: 4,
    adminsCount: 4,
    themeColor: "purple",
    permissions: ["verify_identity", "review_documents", "approve_verifications", "reject_verifications"],
    modules: ["Verification", "User Management"]
  },
  {
    id: "marketplace-moderator",
    name: "Marketplace Moderator",
    roleKey: "MARKETPLACE_MODERATOR",
    status: "Inactive",
    description: "Moderates collaborator profiles, project listings, and reported content.",
    permissionsCount: 5,
    adminsCount: 5,
    themeColor: "yellow",
    permissions: ["manage_marketplace", "moderate_listings", "flag_profiles", "review_reports", "ban_spammers"],
    modules: ["Marketplace Management", "Dispute Resolution"]
  }
];

export const INITIAL_ADMIN_ACCOUNTS: AdminAccountItem[] = [
  {
    id: "admin-1",
    firstName: "Chidi",
    lastName: "Okonkwo",
    email: "chidi@collabden.com",
    roleName: "Super Admin",
    roleKey: "SUPER_ADMIN",
    status: "Active",
    dateAdded: "Jan 11, 2024",
    initials: "CO"
  },
  {
    id: "admin-2",
    firstName: "Amaka",
    lastName: "Eze",
    email: "amaka@collabden.com",
    roleName: "Support Admin",
    roleKey: "SUPPORT_ADMIN",
    status: "Active",
    dateAdded: "Feb 12, 2024",
    initials: "AE"
  }
];

export const INITIAL_ACCESS_LOGS: AccessHistoryLog[] = [
  {
    id: "log-1",
    adminName: "Chidi Okonkwo",
    initials: "CO",
    roleName: "Super Admin",
    roleKey: "SUPER_ADMIN",
    timestamp: "Today, 09:14 AM",
    device: "macOS · Chrome",
    ipAddress: "197.211.45.32",
    status: "Success"
  }
];

class AdminRolesService {
  async getRoles(): Promise<AdminRoleItem[]> {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_PERMISSIONS.ROLES);
      if (response.data?.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
    } catch (error) {
      console.warn("Could not fetch remote roles from API, utilizing fallback data", error);
    }
    return INITIAL_ROLES_DATA;
  }

  async getAvailableRoles(): Promise<any> {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_PERMISSIONS.AVAILABLE_ROLES);
    return response.data?.data || response.data;
  }

  async getRolesHistory(): Promise<any> {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_PERMISSIONS.ROLES_HISTORY);
    return response.data?.data || response.data;
  }

  async getRoleDetail(role: string): Promise<any> {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_PERMISSIONS.ROLE_DETAIL(role));
    return response.data?.data || response.data;
  }

  async updateRole(role: string, payload: Partial<CreateRolePayload>): Promise<any> {
    const response = await axiosInstance.put(API_ENDPOINTS.ADMIN_PERMISSIONS.UPDATE_ROLE(role), payload);
    return response.data?.data || response.data;
  }

  async addRolePermissions(role: string, permissions: string[]): Promise<any> {
    const response = await axiosInstance.patch(API_ENDPOINTS.ADMIN_PERMISSIONS.ADD_ROLE_PERMISSIONS(role), { permissions });
    return response.data?.data || response.data;
  }

  async removeRolePermissions(role: string, permissions: string[]): Promise<any> {
    const response = await axiosInstance.patch(API_ENDPOINTS.ADMIN_PERMISSIONS.REMOVE_ROLE_PERMISSIONS(role), { permissions });
    return response.data?.data || response.data;
  }

  async addRoleModules(role: string, modules: string[]): Promise<any> {
    const response = await axiosInstance.patch(API_ENDPOINTS.ADMIN_PERMISSIONS.ADD_ROLE_MODULES(role), { modules });
    return response.data?.data || response.data;
  }

  async removeRoleModules(role: string, modules: string[]): Promise<any> {
    const response = await axiosInstance.patch(API_ENDPOINTS.ADMIN_PERMISSIONS.REMOVE_ROLE_MODULES(role), { modules });
    return response.data?.data || response.data;
  }

  async deleteRole(role: string): Promise<any> {
    const response = await axiosInstance.delete(API_ENDPOINTS.ADMIN_PERMISSIONS.DELETE_ROLE(role));
    return response.data?.data || response.data;
  }

  async createRole(payload: CreateRolePayload): Promise<AdminRoleItem> {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.ADMIN_PERMISSIONS.ROLES, payload);
      if (response.data?.data) {
        return response.data.data;
      }
    } catch (error) {
      console.warn("Could not create role via API, using local mock", error);
    }
    const newRole: AdminRoleItem = {
      id: `role-${Date.now()}`,
      name: payload.name,
      roleKey: payload.name.toUpperCase().replace(/\s+/g, "_"),
      status: payload.status,
      description: payload.description,
      permissionsCount: payload.permissions.length,
      adminsCount: 0,
      themeColor: payload.status === "Active" ? "green" : "gray",
      permissions: payload.permissions,
      modules: payload.modules,
      createdAt: new Date().toISOString()
    };
    return newRole;
  }

  async getAdminAccounts(): Promise<AdminAccountItem[]> {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_ACCOUNTS.LIST);
      if (response.data?.data && Array.isArray(response.data.data)) {
        return response.data.data.map((u: any) => ({
          id: u.id,
          firstName: u.firstName || "Admin",
          lastName: u.lastName || "User",
          email: u.email,
          roleName: u.role || "Administrator",
          roleKey: u.role || "ADMIN",
          status: u.status === "DEACTIVATED" ? "Inactive" : "Active",
          dateAdded: u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }) : "Jan 1, 2024",
          initials: `${(u.firstName || "A")[0]}${(u.lastName || "U")[0]}`.toUpperCase()
        }));
      }
    } catch (error) {
      console.warn("Could not fetch remote admin accounts, utilizing fallback data", error);
    }
    return INITIAL_ADMIN_ACCOUNTS;
  }

  async updateAdminRole(id: string, roleKey: string): Promise<any> {
    const response = await axiosInstance.put(API_ENDPOINTS.ADMIN_ACCOUNTS.UPDATE_ROLE(id), { role: roleKey });
    return response.data?.data || response.data;
  }

  async deactivateAdmin(id: string): Promise<any> {
    const response = await axiosInstance.patch(API_ENDPOINTS.ADMIN_ACCOUNTS.DEACTIVATE(id));
    return response.data?.data || response.data;
  }

  async inviteAdmin(payload: InviteAdminPayload): Promise<AdminAccountItem> {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.ADMIN_ACCOUNTS.LIST, payload);
      if (response.data?.data) {
        return response.data.data;
      }
    } catch (error) {
      console.warn("Could not invite admin via API, using fallback data", error);
    }
    const newAccount: AdminAccountItem = {
      id: `admin-${Date.now()}`,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      roleName: payload.roleKey.replace(/_/g, " "),
      roleKey: payload.roleKey,
      status: payload.status,
      dateAdded: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      initials: `${payload.firstName[0] || "A"}${payload.lastName[0] || "U"}`.toUpperCase()
    };
    return newAccount;
  }

  async getAccessHistoryLogs(): Promise<AccessHistoryLog[]> {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_ACCOUNTS.ACCESS_LOGS);
      if (response.data?.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
    } catch (error) {
      console.warn("Could not fetch remote access history logs, utilizing fallback data", error);
    }
    return INITIAL_ACCESS_LOGS;
  }
}

export const adminRolesService = new AdminRolesService();
