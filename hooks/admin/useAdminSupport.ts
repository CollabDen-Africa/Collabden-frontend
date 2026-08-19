import { useState, useMemo, useEffect } from "react";
import {
  adminSupportService,
  SupportTicketItem,
  SupportStats,
  INITIAL_SUPPORT_TICKETS,
  TicketStatus,
} from "@/services/admin/support.service";

export const useAdminSupport = () => {
  const [tickets, setTickets] = useState<SupportTicketItem[]>(INITIAL_SUPPORT_TICKETS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [totalTickets, setTotalTickets] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const loadTickets = async () => {
    setIsLoading(true);
    try {
      const data = await adminSupportService.getTickets({
        page,
        search: searchQuery || undefined,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
        priority: priorityFilter !== "ALL" ? priorityFilter : undefined,
        category: categoryFilter !== "ALL" ? categoryFilter : undefined,
      });
      if (data.tickets && data.tickets.length > 0) {
        setTickets(data.tickets);
        setTotalTickets(data.total);
      }
    } catch (error) {
      console.error("Failed to load support tickets", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch =
        searchQuery === "" ||
        ticket.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.userEmail.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || ticket.status === statusFilter;

      const matchesPriority =
        priorityFilter === "ALL" || ticket.priority === priorityFilter;

      const matchesCategory =
        categoryFilter === "ALL" || ticket.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });
  }, [tickets, searchQuery, statusFilter, priorityFilter, categoryFilter]);

  const stats: SupportStats = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter((t) => t.status === "Open").length;
    const inProgress = tickets.filter((t) => t.status === "In Progress").length;
    const resolved = tickets.filter((t) => t.status === "Resolved").length;

    return {
      totalTickets: total,
      openTickets: open,
      inProgressTickets: inProgress,
      resolvedTickets: resolved,
      avgResponseTime: "4.2h",
      slaBreaches: tickets.filter((t) => t.priority === "Critical" && t.status === "Open").length,
    };
  }, [tickets]);

  const handleUpdateStatus = async (ticketId: string, newStatus: TicketStatus) => {
    const success = await adminSupportService.updateTicketStatus(ticketId, newStatus);
    if (success) {
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t))
      );
    }
    return success;
  };

  const handleAssign = async (ticketId: string, adminId: string, adminName: string) => {
    const success = await adminSupportService.assignTicket(ticketId, { adminId, adminName });
    if (success) {
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId
            ? { ...t, assignedTo: adminId, assignedAdmin: adminName, updatedAt: new Date().toISOString() }
            : t
        )
      );
    }
    return success;
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
