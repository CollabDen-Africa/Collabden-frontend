import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

// ─── TypeScript Interfaces ──────────────────────────────────────────────────

export type TicketStatus = "Open" | "In Progress" | "Resolved" | "Closed" | "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type TicketPriority = "Critical" | "High" | "Medium" | "Low" | "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export type TicketCategory =
  | "Payment Issue"
  | "Escrow Dispute"
  | "Account Access"
  | "Verification"
  | "Platform Bug"
  | "General Inquiry"
  | "ACCOUNT"
  | "BILLING"
  | "TECHNICAL"
  | "PROJECT"
  | "COLLABORATION"
  | "VERIFICATION"
  | "DISPUTE"
  | "OTHER";

export interface SupportTicketItem {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  assignedTo?: string;
  assignedAdmin?: string;
  createdAt: string;
  updatedAt: string;
  deadline?: string;
  accountType?: string;
  userRole?: string;
}

export interface SupportTicketDetail extends SupportTicketItem {
  message: string;
  attachments: SupportAttachment[];
  relatedActivity: RelatedActivityItem[];
}

export interface SupportAttachment {
  id: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface RelatedActivityItem {
  id: string;
  type: "Escrow" | "Payment" | "Project" | "Agreement";
  label: string;
  status: string;
  date: string;
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderRole: "user" | "admin";
  senderAvatar?: string;
  content: string;
  attachments?: SupportAttachment[];
  isInternalNote?: boolean;
  createdAt: string;
}

export interface SupportStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  avgResponseTime: string;
  slaBreaches: number;
}

export interface SupportAuditEntry {
  id: string;
  ticketId: string;
  action: string;
  adminName: string;
  userName: string;
  details: string;
  timestamp: string;
}

export interface SupportReportData {
  stats: SupportStats;
  categoryBreakdown: { category: string; count: number; color: string }[];
  auditLogs: SupportAuditEntry[];
}

// Helper to normalize status to UI title case
export const formatTicketStatus = (status: string): TicketStatus => {
  switch (status?.toUpperCase()) {
    case "OPEN":
      return "Open";
    case "IN_PROGRESS":
      return "In Progress";
    case "RESOLVED":
      return "Resolved";
    case "CLOSED":
      return "Closed";
    default:
      return (status as TicketStatus) || "Open";
  }
};

// Helper to normalize status to Backend uppercase
export const toBackendStatus = (status: string): string => {
  switch (status) {
    case "Open":
      return "OPEN";
    case "In Progress":
      return "IN_PROGRESS";
    case "Resolved":
      return "RESOLVED";
    case "Closed":
      return "CLOSED";
    default:
      return status.toUpperCase();
  }
};

// Normalize backend ticket item to frontend UI shape
const transformTicketItem = (item: any): SupportTicketItem => {
  const userName =
    item.userName ||
    (item.user
      ? `${item.user.firstName || ""} ${item.user.lastName || ""}`.trim() ||
        item.user.displayName ||
        item.user.email
      : "Unknown User");

  return {
    id: item.id,
    ticketId: item.ticketNumber || item.ticketId || item.id,
    userId: item.userId || item.user?.id || "",
    userName,
    userEmail: item.userEmail || item.user?.email || "N/A",
    userAvatar: item.userAvatar || item.user?.avatarUrl || "",
    subject: item.subject || item.title || "Support Request",
    category: item.category || "General Inquiry",
    priority: item.priority || "Medium",
    status: formatTicketStatus(item.status || "OPEN"),
    assignedTo: item.assignedAdminId || item.assignedTo || item.assignedAdmin?.id || "",
    assignedAdmin: item.assignedAdminName || item.assignedAdmin?.email || item.assignedAdmin || "Unassigned",
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || item.createdAt || new Date().toISOString(),
    deadline: item.deadline,
    accountType: item.accountType || item.user?.accountStatus || "Standard",
    userRole: item.userRole || item.user?.role || "User",
  };
};

// ─── Service Methods ────────────────────────────────────────────────────────

export const adminSupportService = {
  getTickets: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    priority?: string;
    category?: string;
  }): Promise<{ tickets: SupportTicketItem[]; total: number; summary?: any }> => {
    try {
      const apiParams: Record<string, any> = { ...params };
      if (apiParams.status && apiParams.status !== "ALL" && apiParams.status !== "All") {
        apiParams.status = toBackendStatus(apiParams.status);
      } else {
        delete apiParams.status;
      }
      if (apiParams.category === "ALL" || apiParams.category === "All") {
        delete apiParams.category;
      }

      const res = await axiosInstance.get(API_ENDPOINTS.ADMIN_SUPPORT.LIST, { params: apiParams });
      const body = res.data;
      const rawData = body?.data || body;
      const ticketsArray = rawData?.tickets || (Array.isArray(rawData) ? rawData : []);
      const formatted = ticketsArray.map(transformTicketItem);

      return {
        tickets: formatted,
        total: rawData?.total || formatted.length,
        summary: rawData?.summary,
      };
    } catch (err) {
      console.error("Error fetching live support tickets:", err);
      return { tickets: [], total: 0 };
    }
  },

  getTicketDetail: async (id: string): Promise<SupportTicketDetail | null> => {
    try {
      const res = await axiosInstance.get(API_ENDPOINTS.ADMIN_SUPPORT.DETAIL(id));
      const body = res.data;
      const item = body?.data || body;
      if (!item) return null;

      const base = transformTicketItem(item);
      return {
        ...base,
        message: item.description || item.message || "No initial description provided.",
        attachments: (item.attachments || []).map((a: any) => ({
          id: a.id || `att-${Date.now()}`,
          fileName: a.fileName || a.name || "attachment",
          fileType: a.fileType || a.mimeType || "application/octet-stream",
          fileUrl: a.fileUrl || a.url || "#",
          uploadedAt: a.uploadedAt || a.createdAt || base.createdAt,
        })),
        relatedActivity: item.relatedActivity || [],
      };
    } catch (err) {
      console.error(`Error fetching ticket detail for ${id}:`, err);
      return null;
    }
  },

  getTicketMessages: async (id: string): Promise<SupportMessage[]> => {
    try {
      const res = await axiosInstance.get(API_ENDPOINTS.ADMIN_SUPPORT.MESSAGES(id));
      const body = res.data;
      const rawMsgs = body?.data?.messages || body?.data || (Array.isArray(body) ? body : []);
      
      return rawMsgs.map((m: any) => ({
        id: m.id,
        ticketId: m.ticketId || id,
        senderId: m.senderId || m.adminId || m.userId || "",
        senderName: m.senderName || m.sender?.displayName || (m.isAdmin ? "Support Admin" : "User"),
        senderRole: m.senderRole || (m.isAdmin || m.isInternal ? "admin" : "user"),
        senderAvatar: m.senderAvatar || m.sender?.avatarUrl || "",
        content: m.message || m.content || "",
        attachments: m.attachments || [],
        isInternalNote: m.isInternal || m.isInternalNote || false,
        createdAt: m.createdAt || new Date().toISOString(),
      }));
    } catch (err) {
      console.error(`Error fetching ticket messages for ${id}:`, err);
      return [];
    }
  },

  sendMessage: async (
    id: string,
    payload: { content: string; isInternalNote?: boolean }
  ): Promise<SupportMessage | null> => {
    try {
      const backendPayload = {
        message: payload.content,
        isInternal: Boolean(payload.isInternalNote),
      };
      const res = await axiosInstance.post(API_ENDPOINTS.ADMIN_SUPPORT.MESSAGES(id), backendPayload);
      const body = res.data;
      const m = body?.data || body;

      return {
        id: m.id || `msg-${Date.now()}`,
        ticketId: id,
        senderId: m.senderId || "admin",
        senderName: m.senderName || "Support Admin",
        senderRole: "admin",
        content: m.message || payload.content,
        isInternalNote: m.isInternal || payload.isInternalNote,
        createdAt: m.createdAt || new Date().toISOString(),
      };
    } catch (err) {
      console.error(`Error sending message for ticket ${id}:`, err);
      throw err;
    }
  },

  assignTicket: async (
    id: string,
    payload: { adminId: string; adminName: string }
  ): Promise<boolean> => {
    try {
      await axiosInstance.patch(API_ENDPOINTS.ADMIN_SUPPORT.ASSIGN(id), {
        assignedAdminId: payload.adminId,
      });
      return true;
    } catch (err) {
      console.error(`Error assigning ticket ${id}:`, err);
      throw err;
    }
  },

  updateTicketStatus: async (id: string, status: TicketStatus): Promise<boolean> => {
    try {
      const backendStatus = toBackendStatus(status);
      await axiosInstance.patch(API_ENDPOINTS.ADMIN_SUPPORT.UPDATE_STATUS(id), {
        status: backendStatus,
      });
      return true;
    } catch (err) {
      console.error(`Error updating ticket status for ${id}:`, err);
      throw err;
    }
  },

  getReports: async (params?: { dateRange?: string; groupBy?: string }): Promise<SupportReportData> => {
    try {
      const res = await axiosInstance.get(API_ENDPOINTS.ADMIN_SUPPORT.REPORTS, { params });
      const body = res.data;
      const data = body?.data || body;

      return {
        stats: {
          totalTickets: data?.summary?.totalCount || 0,
          openTickets: data?.summary?.openCount || 0,
          inProgressTickets: data?.summary?.inProgressCount || 0,
          resolvedTickets: data?.summary?.resolvedCount || 0,
          avgResponseTime: data?.avgResponseTime || "N/A",
          slaBreaches: data?.slaBreaches || 0,
        },
        categoryBreakdown: data?.categoryBreakdown || [],
        auditLogs: data?.auditLogs || [],
      };
    } catch (err) {
      console.error("Error fetching support reports:", err);
      return {
        stats: { totalTickets: 0, openTickets: 0, inProgressTickets: 0, resolvedTickets: 0, avgResponseTime: "0h", slaBreaches: 0 },
        categoryBreakdown: [],
        auditLogs: [],
      };
    }
  },

  getAuditLogs: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{ auditLogs: SupportAuditEntry[]; total: number }> => {
    try {
      const res = await axiosInstance.get(API_ENDPOINTS.ADMIN_SUPPORT.AUDIT, { params });
      const body = res.data;
      const data = body?.data || body;
      const logs = data?.auditLogs || data?.logs || (Array.isArray(data) ? data : []);

      return {
        auditLogs: logs.map((l: any) => ({
          id: l.id,
          ticketId: l.ticketId || l.ticket?.ticketNumber || "N/A",
          action: l.action || l.event || "LOGGED",
          adminName: l.adminName || l.admin?.email || "Admin",
          userName: l.userName || l.user?.email || "User",
          details: typeof l.details === "string" ? l.details : JSON.stringify(l.details || {}),
          timestamp: l.createdAt || l.timestamp || new Date().toISOString(),
        })),
        total: data?.total || logs.length,
      };
    } catch (err) {
      console.error("Error fetching support audit logs:", err);
      return { auditLogs: [], total: 0 };
    }
  },
};

export default adminSupportService;
