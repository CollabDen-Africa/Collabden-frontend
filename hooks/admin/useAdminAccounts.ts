import { useState, useMemo, useEffect } from "react";
import { 
  adminRolesService, 
  AdminAccountItem, 
  InviteAdminPayload, 
  INITIAL_ADMIN_ACCOUNTS 
} from "@/services/admin/roles.service";

export const useAdminAccounts = (initialRoleFilter?: string) => {
  const [accounts, setAccounts] = useState<AdminAccountItem[]>(INITIAL_ADMIN_ACCOUNTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>(initialRoleFilter || "ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadAccounts = async () => {
      setIsLoading(true);
      try {
        const data = await adminRolesService.getAdminAccounts();
        if (data && data.length > 0) {
          setAccounts(data);
        }
      } catch (error) {
        console.error("Failed to load admin accounts", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAccounts();
  }, []);

  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      const matchesSearch =
        `${acc.firstName} ${acc.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        acc.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        acc.roleName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole =
        roleFilter === "ALL" ||
        acc.roleKey.toUpperCase() === roleFilter.toUpperCase() ||
        acc.roleName.toUpperCase() === roleFilter.toUpperCase();

      const matchesStatus =
        statusFilter === "ALL" ||
        acc.status.toUpperCase() === statusFilter.toUpperCase();

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [accounts, searchQuery, roleFilter, statusFilter]);

  const handleInviteAdmin = async (payload: InviteAdminPayload) => {
    const created = await adminRolesService.inviteAdmin(payload);
    setAccounts((prev) => [created, ...prev]);
    return created;
  };

  const handleToggleStatus = (adminId: string) => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === adminId) {
          return {
            ...acc,
            status: acc.status === "Active" ? "Inactive" : "Active",
          };
        }
        return acc;
      })
    );
  };

  const handleDeleteAdmin = (adminId: string) => {
    setAccounts((prev) => prev.filter((acc) => acc.id !== adminId));
  };

  return {
    accounts: filteredAccounts,
    allAccounts: accounts,
    isLoading,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    handleInviteAdmin,
    handleToggleStatus,
    handleDeleteAdmin,
  };
};
