import { localApi } from "@/lib/axios";
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
  },
  {
    id: "admin-3",
    firstName: "Tunde",
    lastName: "Bello",
    email: "tunde@collabden.com",
    roleName: "Finance Admin",
    roleKey: "FINANCE_ADMIN",
    status: "Active",
    dateAdded: "Mar 3, 2024",
    initials: "TB"
  },
  {
    id: "admin-4",
    firstName: "Zara",
    lastName: "Musa",
    email: "zara@collabden.com",
    roleName: "Verification Admin",
    roleKey: "VERIFICATION_ADMIN",
    status: "Active",
    dateAdded: "Mar 20, 2024",
    initials: "ZM"
  },
  {
    id: "admin-5",
    firstName: "Emeka",
    lastName: "Nwosu",
    email: "emeka@collabden.com",
    roleName: "Marketplace Moderator",
    roleKey: "MARKETPLACE_MODERATOR",
    status: "Inactive",
    dateAdded: "Apr 7, 2024",
    initials: "EN"
  },
  {
    id: "admin-6",
    firstName: "Fatima",
    lastName: "Al-Said",
    email: "fatima@collabden.com",
    roleName: "Support Admin",
    roleKey: "SUPPORT_ADMIN",
    status: "Active",
    dateAdded: "May 1, 2024",
    initials: "FA"
  },
  {
    id: "admin-7",
    firstName: "Kola",
    lastName: "Adewale",
    email: "kola@collabden.com",
    roleName: "Finance Admin",
    roleKey: "FINANCE_ADMIN",
    status: "Active",
    dateAdded: "May 19, 2024",
    initials: "KA"
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
  },
  {
    id: "log-2",
    adminName: "Amaka Eze",
    initials: "AE",
    roleName: "Support Admin",
    roleKey: "SUPPORT_ADMIN",
    timestamp: "Today, 08:52 AM",
    device: "Windows · Edge",
    ipAddress: "105.112.78.11",
    status: "Success"
  },
  {
    id: "log-3",
    adminName: "Tunde Bello",
    initials: "TB",
    roleName: "Finance Admin",
    roleKey: "FINANCE_ADMIN",
    timestamp: "Today, 08:31 AM",
    device: "macOS · Safari",
    ipAddress: "197.255.101.5",
    status: "Success"
  },
  {
    id: "log-4",
    adminName: "Unknown",
    initials: "?",
    roleName: "—",
    roleKey: "UNKNOWN",
    timestamp: "Yesterday, 11:47 PM",
    device: "Linux · Firefox",
    ipAddress: "45.153.204.19",
    status: "Failed",
    isSuspicious: true
  },
  {
    id: "log-5",
    adminName: "Zara Musa",
    initials: "ZM",
    roleName: "Verification Admin",
    roleKey: "VERIFICATION_ADMIN",
    timestamp: "Yesterday, 06:20 PM",
    device: "iOS · Safari",
    ipAddress: "197.211.89.44",
    status: "Success"
  },
  {
    id: "log-6",
    adminName: "Fatima Al-Said",
    initials: "FA",
    roleName: "Support Admin",
    roleKey: "SUPPORT_ADMIN",
    timestamp: "Yesterday, 03:15 PM",
    device: "Android · Chrome",
    ipAddress: "105.100.34.77",
    status: "Success"
  },
  {
    id: "log-7",
    adminName: "Kola Adewale",
    initials: "KA",
    roleName: "Finance Admin",
    roleKey: "FINANCE_ADMIN",
    timestamp: "Jul 13, 2025, 10:08 AM",
    device: "Windows · Chrome",
    ipAddress: "197.210.55.88",
    status: "Success"
  },
  {
    id: "log-8",
    adminName: "Unknown",
    initials: "?",
    roleName: "—",
    roleKey: "UNKNOWN",
    timestamp: "Jul 13, 2025, 03:22 AM",
    device: "Unknown Device",
    ipAddress: "83.22.144.201",
    status: "Locked",
    isSuspicious: true
  }
];

class AdminRolesService {
  async getRoles(): Promise<AdminRoleItem[]> {
    try {
      const response = await localApi.get(API_ENDPOINTS.ADMIN_AUTH.ROLES);
      if (response.data?.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
    } catch (error) {
      console.warn("Could not fetch remote roles from API, utilizing fallback data", error);
    }
    return INITIAL_ROLES_DATA;
  }

  async createRole(payload: CreateRolePayload): Promise<AdminRoleItem> {
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
      const response = await localApi.get(API_ENDPOINTS.ADMIN_AUTH.ADMIN_ACCOUNTS);
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

  async inviteAdmin(payload: InviteAdminPayload): Promise<AdminAccountItem> {
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
      const response = await localApi.get(API_ENDPOINTS.ADMIN_AUTH.ADMIN_ACCESS_LOGS);
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
