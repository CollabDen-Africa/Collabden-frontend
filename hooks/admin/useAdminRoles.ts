import { useState, useMemo, useEffect } from "react";
import { 
  adminRolesService, 
  AdminRoleItem, 
  RolesStats, 
  INITIAL_ROLES_DATA,
  CreateRolePayload 
} from "@/services/admin/roles.service";

export const useAdminRoles = () => {
  const [roles, setRoles] = useState<AdminRoleItem[]>(INITIAL_ROLES_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(false);

  const loadRoles = async () => {
    setIsLoading(true);
    try {
      const fetched = await adminRolesService.getRoles();
      if (fetched && fetched.length > 0) {
        setRoles(fetched);
      }
    } catch (error) {
      console.error("Failed to load admin roles", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const filteredRoles = useMemo(() => {
    return roles.filter((role) => {
      const matchesSearch = 
        role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.roleKey.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = 
        statusFilter === "ALL" || 
        role.status.toUpperCase() === statusFilter.toUpperCase();

      return matchesSearch && matchesStatus;
    });
  }, [roles, searchQuery, statusFilter]);

  const stats: RolesStats = useMemo(() => {
    const totalRoles = roles.length;
    const totalAdmins = roles.reduce((acc, r) => acc + r.adminsCount, 0);
    const activeRoles = roles.filter((r) => r.status === "Active").length;
    const inactiveRoles = roles.filter((r) => r.status === "Inactive").length;

    return {
      totalRoles,
      totalAdmins,
      activeRoles,
      inactiveRoles,
    };
  }, [roles]);

  const handleCreateRole = async (payload: CreateRolePayload) => {
    const created = await adminRolesService.createRole(payload);
    setRoles((prev) => [created, ...prev]);
    return created;
  };

  const handleUpdateRole = async (roleKey: string, payload: Partial<CreateRolePayload>) => {
    const updated = await adminRolesService.updateRole(roleKey, payload);
    await loadRoles();
    return updated;
  };

  const handleAddPermissions = async (roleKey: string, permissions: string[]) => {
    const updated = await adminRolesService.addRolePermissions(roleKey, permissions);
    await loadRoles();
    return updated;
  };

  const handleRemovePermissions = async (roleKey: string, permissions: string[]) => {
    const updated = await adminRolesService.removeRolePermissions(roleKey, permissions);
    await loadRoles();
    return updated;
  };

  const handleToggleRoleStatus = (roleId: string) => {
    setRoles((prev) =>
      prev.map((role) => {
        if (role.id === roleId) {
          const newStatus = role.status === "Active" ? "Inactive" : "Active";
          return {
            ...role,
            status: newStatus,
            themeColor: newStatus === "Active" ? "green" : "gray"
          };
        }
        return role;
      })
    );
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      await adminRolesService.deleteRole(roleId);
    } catch {
      // Fallback local update
    }
    setRoles((prev) => prev.filter((r) => r.id !== roleId));
  };

  return {
    roles: filteredRoles,
    allRoles: roles,
    stats,
    isLoading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    handleCreateRole,
    handleUpdateRole,
    handleAddPermissions,
    handleRemovePermissions,
    handleToggleRoleStatus,
    handleDeleteRole,
    refreshRoles: loadRoles,
  };
};
