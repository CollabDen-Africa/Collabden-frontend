import { useState, useEffect, useCallback } from "react";
import {
  adminSupportService,
  SupportTicketDetail,
  SupportMessage,
  TicketStatus,
} from "@/services/admin/support.service";

export const useAdminSupportDetail = (ticketId: string) => {
  const [ticket, setTicket] = useState<SupportTicketDetail | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);

  const loadTicket = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await adminSupportService.getTicketDetail(ticketId);
      setTicket(data);
    } catch (error) {
      console.error("Failed to load ticket detail", error);
    } finally {
      setIsLoading(false);
    }
  }, [ticketId]);

  const loadMessages = useCallback(async () => {
    setIsLoadingMessages(true);
    try {
      const data = await adminSupportService.getTicketMessages(ticketId);
      setMessages(data);
    } catch (error) {
      console.error("Failed to load ticket messages", error);
    } finally {
      setIsLoadingMessages(false);
    }
  }, [ticketId]);

  useEffect(() => {
    loadTicket();
    loadMessages();
  }, [loadTicket, loadMessages]);

  const sendMessage = async (content: string, isInternalNote = false) => {
    const newMsg = await adminSupportService.sendMessage(ticketId, { content, isInternalNote });
    if (newMsg) {
      setMessages((prev) => [...prev, newMsg]);
    }
    return newMsg;
  };

  const assignTicket = async (adminId: string, adminName: string) => {
    const success = await adminSupportService.assignTicket(ticketId, { adminId, adminName });
    if (success && ticket) {
      setTicket({ ...ticket, assignedTo: adminId, assignedAdmin: adminName });
    }
    return success;
  };

  const updateStatus = async (status: TicketStatus) => {
    const success = await adminSupportService.updateTicketStatus(ticketId, status);
    if (success && ticket) {
      setTicket({ ...ticket, status, updatedAt: new Date().toISOString() });
    }
    return success;
  };

  return {
    ticket,
    messages,
    isLoading,
    isLoadingMessages,
    sendMessage,
    assignTicket,
    updateStatus,
    refetch: loadTicket,
    refetchMessages: loadMessages,
  };
};
