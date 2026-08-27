"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { ShieldCheck, Eye, UserPlus, FileText, CheckCircle2, XCircle, RefreshCw, History } from 'lucide-react';
import { Table, Column } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import AuditHeader from './AuditHeader';
import AuditStatCards, { StatItem } from './AuditStatCards';
import AuditControls from './AuditControls';

// --- MOCK DATA ---
const AUDIT_DATA = [
  { id: '1', actionTitle: 'Verification Request Accessed', details: 'VRQ-0811 (Tolu Adeyemi) opened for review.', iconType: 'view', admin: 'Verification Admin', initials: 'VA', role: 'Verification Admin', roleColor: 'text-[#A78BFA]', roleBg: 'bg-[#A78BFA]/10', date: 'Jul 11, 2025 · 4:02 PM' },
  { id: '2', actionTitle: 'Request Assigned to Self', details: 'VRQ-0811 assigned to Verification Admin for review', iconType: 'assign', admin: 'Verification Admin', initials: 'VA', role: 'Verification Admin', roleColor: 'text-[#A78BFA]', roleBg: 'bg-[#A78BFA]/10', date: 'Jul 11, 2025 · 4:03 PM' },
  { id: '3', actionTitle: 'Identity Documents Viewed', details: 'National ID (front & back) and selfie accessed for...', iconType: 'view', admin: 'Verification Admin', initials: 'VA', role: 'Verification Admin', roleColor: 'text-[#A78BFA]', roleBg: 'bg-[#A78BFA]/10', date: 'Jul 11, 2025 · 4:10 PM' },
  { id: '4', actionTitle: 'Internal Note Added', details: 'Document quality confirmed. Selfie matches ID phot...', iconType: 'note', admin: 'Verification Admin', initials: 'VA', role: 'Verification Admin', roleColor: 'text-[#A78BFA]', roleBg: 'bg-[#A78BFA]/10', date: 'Jul 11, 2025 · 4:18 PM' },
  { id: '5', actionTitle: 'Verification Approved — VRQ-0814', details: 'Amara Osei approved. Verified badge granted. User...', iconType: 'approve', admin: 'Verification Admin', initials: 'VA', role: 'Verification Admin', roleColor: 'text-[#A78BFA]', roleBg: 'bg-[#A78BFA]/10', date: 'Jul 12, 2025 · 10:02 AM' },
  { id: '6', actionTitle: 'Verification Rejected — VRQ-0780', details: 'Marcus Lee rejected. Reason: Document blurry or un...', iconType: 'reject', admin: 'Verification Admin', initials: 'VA', role: 'Verification Admin', roleColor: 'text-[#A78BFA]', roleBg: 'bg-[#A78BFA]/10', date: 'Jul 4, 2025 · 2:30 PM' },
  { id: '7', actionTitle: 'Resubmission Prompted — USR-0318', details: 'Marcus Lee prompted to resubmit identity documents', iconType: 'prompt', admin: 'Verification Admin', initials: 'VA', role: 'Verification Admin', roleColor: 'text-[#A78BFA]', roleBg: 'bg-[#A78BFA]/10', date: 'Jul 5, 2025 · 9:00 AM' },
  { id: '8', actionTitle: 'Verification History Accessed', details: 'Viewed complete verification history for Marcus Le...', iconType: 'history', admin: 'Super Admin', initials: 'SA', role: 'Super Admin', roleColor: 'text-primary-green', roleBg: 'bg-primary-green/10', date: 'Jul 8, 2025 · 11:44 AM' }
];

const CSV_HEADERS = [
  { label: 'ID', key: 'id' },
  { label: 'Action', key: 'actionTitle' },
  { label: 'Details', key: 'details' },
  { label: 'Admin', key: 'admin' },
  { label: 'Role', key: 'role' },
  { label: 'Date', key: 'date' },
];

const ITEMS_PER_PAGE = 5;

// --- HELPERS ---
const getIconConfig = (type: string) => {
  switch (type) {
    case 'assign': return { icon: UserPlus, bg: 'bg-primary-green/10', border: 'border-primary-green/20', text: 'text-primary-green' };
    case 'note': return { icon: FileText, bg: 'bg-primary-blue/10', border: 'border-secondary-blue/20', text: 'text-secondary-blue' };
    case 'approve': return { icon: CheckCircle2, bg: 'bg-primary-green/10', border: 'border-primary-green/20', text: 'text-primary-green' };
    case 'reject': return { icon: XCircle, bg: 'bg-accent-red/10', border: 'border-accent-red/20', text: 'text-accent-red' };
    case 'prompt': return { icon: RefreshCw, bg: 'bg-accent-yellow/10', border: 'border-accent-yellow/20', text: 'text-accent-yellow' };
    case 'history': return { icon: History, bg: 'bg-white/[0.03]', border: 'border-white/[0.09]', text: 'text-white/45' };
    case 'view':
    default: return { icon: Eye, bg: 'bg-white/[0.03]', border: 'border-white/[0.09]', text: 'text-white/45' };
  }
};

export default function VerificationAuditLogScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("All Actions");
  const [adminFilter, setAdminFilter] = useState("All Admins");
  const [dateFilter, setDateFilter] = useState("Date Range");
  const [currentPage, setCurrentPage] = useState(1);

  // --- FILTER LOGIC ---
  const filteredData = useMemo(() => {
    return AUDIT_DATA.filter((item) => {
      const searchMatch = 
        item.actionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.admin.toLowerCase().includes(searchTerm.toLowerCase());

      const actionMatch = actionFilter === "All Actions" ||
        (actionFilter === "Approvals" && item.iconType === "approve") ||
        (actionFilter === "Rejections" && item.iconType === "reject");

      const adminMatch = adminFilter === "All Admins" ||
        (adminFilter === "Super Admins" && item.role === "Super Admin") ||
        (adminFilter === "Verification Admins" && item.role === "Verification Admin");
      
      const dateMatch = dateFilter === "Date Range" || item.date.includes(dateFilter.split(' ')[0]);

      return searchMatch && actionMatch && adminMatch && dateMatch;
    });
  }, [searchTerm, actionFilter, adminFilter, dateFilter]);

  // --- PAGINATION LOGIC ---
  const totalItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 if filters push current page out of bounds
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  // --- STATS LOGIC ---
  const stats: StatItem[] = [
    { label: 'Total Logged Actions', value: filteredData.length, barColor: 'bg-white/45' },
    { label: 'Approvals Recorded', value: filteredData.filter(i => i.iconType === 'approve').length, barColor: 'bg-primary-green' },
    { label: 'Rejections Recorded', value: filteredData.filter(i => i.iconType === 'reject').length, barColor: 'bg-accent-red' },
    { label: 'Admins Involved', value: new Set(filteredData.map(i => i.admin)).size, barColor: 'bg-[#A78BFA]' }
  ];

  // --- TABLE COLUMNS ---
  const columns: Column<typeof AUDIT_DATA[0]>[] = [
    { 
      key: 'id', 
      label: '#', 
      render: (item) => <span className="font-inter text-[11px] text-white/45 tracking-[0.7px]">{item.id}</span> 
    },
    { 
      key: 'actionTitle', 
      label: 'Action Performed', 
      render: (item) => {
        const { icon: Icon, bg, border, text } = getIconConfig(item.iconType);
        return (
          <div className="flex items-center gap-2 py-1">
            <div className={`flex items-center justify-center w-7 h-7 rounded-lg border-[0.8px] ${bg} ${border} shrink-0`}>
              <Icon size={12} className={text} />
            </div>
            <span className="font-raleway font-bold text-[12px] text-white whitespace-nowrap">{item.actionTitle}</span>
          </div>
        );
      }
    },
    { 
      key: 'details', 
      label: 'Details', 
      render: (item) => <span className="font-inter text-[11px] text-white/70 max-w-60 truncate block">{item.details}</span> 
    },
    { 
      key: 'adminName', 
      label: 'Administrator',
      render: (item) => (
        <div className="flex items-center gap-1.75">
          <div className={`flex items-center justify-center w-5.5 h-5.5 rounded-[9.26px] border border-white/9 shrink-0 ${item.roleBg}`}>
            <span className={`font-raleway font-bold text-[8px] ${item.roleColor}`}>{item.initials}</span>
          </div>
          <span className="font-raleway font-semibold text-[12px] text-white whitespace-nowrap">{item.admin}</span>
        </div>
      )
    },
    { 
      key: 'role', 
      label: 'Role',
      render: (item) => (
        <span className={`px-2.5 py-1 rounded-full font-inter font-bold text-[10px] whitespace-nowrap ${item.roleBg} ${item.roleColor}`}>
          {item.role}
        </span>
      )
    },
    { 
      key: 'date', 
      label: 'Date & Time',
      render: (item) => <span className="font-inter text-[11px] text-white/45 whitespace-nowrap">{item.date}</span>
    },
  ];

  return (
    <div className="flex flex-col items-start p-4 sm:p-6 md:pt-5.5 md:px-7 md:pb-10 w-full max-w-400 mx-auto min-h-screen bg-background custom-scrollbar">
      
      <AuditHeader data={filteredData} csvHeaders={CSV_HEADERS} />

      <AuditStatCards stats={stats} />

      <AuditControls 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm}
        actionFilter={actionFilter} 
        onActionFilterChange={setActionFilter}
        adminFilter={adminFilter} 
        onAdminFilterChange={setAdminFilter}
        dateFilter={dateFilter} 
        onDateFilterChange={setDateFilter}
      />

      {/* Main Table View Wrapper */}
      <div className="flex flex-col items-start w-full max-w-300 mt-4.5">
        <div className="flex flex-col w-full bg-white/5 border-[0.8px] border-white/9 rounded-[20px] overflow-hidden">
          
          <div className="w-full overflow-x-auto custom-scrollbar">
            <div className="min-w-200">
              <Table columns={columns} data={paginatedData} />
            </div>
          </div>

          {/* Table Footer */}
          <div className="flex justify-between items-center px-5 py-3.25 w-full bg-white/3 border-t-[0.8px] border-white/9">
            <span className="font-inter text-[12px] leading-4.5 text-white/45">
              {filteredData.length} entries · Retention: 7 years
            </span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={11} className="text-primary-green" />
              <span className="font-inter font-semibold text-[11px] leading-4 text-primary-green">
                Cryptographically Sealed
              </span>
            </div>
          </div>
          
        </div>
      </div>

      <div className="mt-4 w-full max-w-300 flex justify-center sm:justify-start">
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          currentItemsCount={paginatedData.length}
          totalItems={totalItems}
          itemName="entries"
        />
      </div>

    </div>
  );
}