import axios from "axios";
import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

const ADMIN_PERMISSIONS_PROXY = "/api/proxy/admin/permissions";

const adminProxyGet = async <T>(path: string): Promise<T> => {
  const response = await axios.get<T>(path, { withCredentials: true });
  return response.data;
};

const adminProxyPut = async <T>(path: string, payload: unknown): Promise<T> => {
  const response = await axios.put<T>(path, payload, { withCredentials: true });
  return response.data;
};

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
      const roles = await adminProxyGet<any[]>(ADMIN_PERMISSIONS_PROXY);
      const themeColors: Record<string, AdminRoleItem["themeColor"]> = {
        SUPER_ADMIN: "green",
        SUPPORT_ADMIN: "blue",
        FINANCE_ADMIN: "green",
        VERIFICATION_ADMIN: "purple",
        MARKETPLACE_MODERATOR: "yellow",
      };

      return roles.map((role) => ({
        id: role.role,
        name: role.role.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (letter: string) => letter.toUpperCase()),
        roleKey: role.role,
        status: "Active",
        description: "Administrative permissions configuration.",
        permissionsCount: role.permissions?.length || 0,
        adminsCount: role.assignedAdmins || 0,
        themeColor: themeColors[role.role] || "gray",
        permissions: role.permissions || [],
        modules: role.modules || [],
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
      }));
    } catch (error) {
      console.warn("Could not fetch live admin roles", error);
    }
    return [];
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
    return adminProxyGet(`${ADMIN_PERMISSIONS_PROXY}/${role}`);
  }

  async updateRolePermissions(role: string, permissions: string[], modules: string[]): Promise<any> {
    return adminProxyPut(`${ADMIN_PERMISSIONS_PROXY}/${role}`, { permissions, modules });
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
