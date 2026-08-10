import { useState, useMemo, useEffect } from "react";
import { 
  adminRolesService, 
  AccessHistoryLog, 
  INITIAL_ACCESS_LOGS 
} from "@/services/admin/roles.service";

export const useAccessHistory = () => {
  const [logs, setLogs] = useState<AccessHistoryLog[]>(INITIAL_ACCESS_LOGS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadLogs = async () => {
      setIsLoading(true);
      try {
        const fetched = await adminRolesService.getAccessHistoryLogs();
        if (fetched && fetched.length > 0) {
          setLogs(fetched);
        }
      } catch (error) {
        console.error("Failed to load access history logs", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.adminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.ipAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.device.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ||
        log.status.toUpperCase() === statusFilter.toUpperCase();

      return matchesSearch && matchesStatus;
    });
  }, [logs, searchQuery, statusFilter]);

  const suspiciousCount = useMemo(() => {
    return logs.filter((l) => l.isSuspicious || l.status === "Failed" || l.status === "Locked").length;
  }, [logs]);

  return {
    logs: filteredLogs,
    allLogs: logs,
    suspiciousCount,
    isLoading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
  };
};
