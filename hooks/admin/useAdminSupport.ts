import { useState, useMemo, useEffect, useCallback } from "react";
import {
  adminSupportService,
  SupportTicketItem,
  SupportStats,
  TicketStatus,
} from "@/services/admin/support.service";

export const useAdminSupport = () => {
  const [tickets, setTickets] = useState<SupportTicketItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [totalTickets, setTotalTickets] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [backendSummary, setBackendSummary] = useState<any>(null);

  const loadTickets = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await adminSupportService.getTickets({
        page,
        search: searchQuery || undefined,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
        priority: priorityFilter !== "ALL" ? priorityFilter : undefined,
        category: categoryFilter !== "ALL" ? categoryFilter : undefined,
      });

      setTickets(data.tickets || []);
      setTotalTickets(data.total || 0);
      if (data.summary) {
        setBackendSummary(data.summary);
      }
    } catch (error) {
      console.error("Failed to load live support tickets", error);
      setTickets([]);
      setTotalTickets(0);
    } finally {
      setIsLoading(false);
    }
  }, [page, searchQuery, statusFilter, priorityFilter, categoryFilter]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch =
        searchQuery === "" ||
        ticket.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.userEmail.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || ticket.status.toUpperCase() === statusFilter.toUpperCase();

      const matchesPriority =
        priorityFilter === "ALL" || ticket.priority.toUpperCase() === priorityFilter.toUpperCase();

      const matchesCategory =
        categoryFilter === "ALL" || ticket.category.toUpperCase() === categoryFilter.toUpperCase();

      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });
  }, [tickets, searchQuery, statusFilter, priorityFilter, categoryFilter]);

  const stats: SupportStats = useMemo(() => {
    if (backendSummary) {
      return {
        totalTickets: backendSummary.totalCount || totalTickets,
        openTickets: backendSummary.openCount || 0,
        inProgressTickets: backendSummary.inProgressCount || 0,
        resolvedTickets: backendSummary.resolvedCount || 0,
        avgResponseTime: "4.2h",
        slaBreaches: backendSummary.unassignedCount || 0,
      };
    }

    const total = tickets.length;
    const open = tickets.filter((t) => t.status?.toUpperCase() === "OPEN" || t.status === "Open").length;
    const inProgress = tickets.filter((t) => t.status?.toUpperCase() === "IN_PROGRESS" || t.status === "In Progress").length;
    const resolved = tickets.filter((t) => t.status?.toUpperCase() === "RESOLVED" || t.status === "Resolved").length;

    return {
      totalTickets: total,
      openTickets: open,
      inProgressTickets: inProgress,
      resolvedTickets: resolved,
      avgResponseTime: "4.2h",
      slaBreaches: tickets.filter((t) => t.priority?.toUpperCase() === "CRITICAL" && t.status?.toUpperCase() === "OPEN").length,
    };
  }, [tickets, backendSummary, totalTickets]);

  const handleUpdateStatus = async (ticketId: string, newStatus: TicketStatus) => {
    try {
      const success = await adminSupportService.updateTicketStatus(ticketId, newStatus);
      if (success) {
        await loadTickets();
      }
      return success;
    } catch (err) {
      console.error("Failed to update ticket status:", err);
      return false;
    }
  };

  const handleAssign = async (ticketId: string, adminId: string, adminName: string) => {
    try {
      const success = await adminSupportService.assignTicket(ticketId, { adminId, adminName });
      if (success) {
        await loadTickets();
      }
      return success;
    } catch (err) {
      console.error("Failed to assign ticket:", err);
      return false;
    }
  };

  return {
    tickets: filteredTickets,
    allTickets: tickets,
    stats,
    isLoading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    categoryFilter,
    setCategoryFilter,
    page,
    setPage,
    totalTickets,
    handleUpdateStatus,
    handleAssign,
    refetch: loadTickets,
  };
};

export default useAdminSupport;
