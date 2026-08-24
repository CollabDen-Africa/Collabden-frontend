"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { AlertCircle, ScanFace, FileText, CheckCircle2 } from 'lucide-react';
import { Table, Column } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import Avatar from '@/components/ui/Avatar';
import DashboardHeader from './Header';
import DashboardStatCards, { StatItem } from './StatCards';
import DashboardControls from './Controls';
import DashboardAlert from './Alert';

// --- MOCK DATA ---
const REQUESTS = [
  { id: 'VRQ-0814', user: 'Amara Osei', userId: 'USR-0041', type: 'Selfie + ID', typeBg: 'bg-[#11EA9B]/10', typeText: 'text-[#11EA9B]', status: 'Pending', statusBg: 'bg-primary-blue/10', statusText: 'text-secondary-blue', attempts: 1, assigned: '—', date: 'Jul 12, 2025' },
  { id: 'VRQ-0811', user: 'Tolu Adeyemi', userId: 'USR-0102', type: 'Identity Document', typeBg: 'bg-[#A78BFA]/10', typeText: 'text-[#A78BFA]', status: 'Under Review', statusBg: 'bg-accent-yellow/10', statusText: 'text-accent-yellow', attempts: 1, assigned: 'Verification Admin', date: 'Jul 11, 2025' },
  { id: 'VRQ-0797', user: 'Chisom Eze', userId: 'USR-0205', type: 'Selfie + ID', typeBg: 'bg-[#11EA9B]/10', typeText: 'text-[#11EA9B]', status: 'Approved', statusBg: 'bg-primary-green/10', statusText: 'text-primary-green', attempts: 1, assigned: 'Verification Admin', date: 'Jul 5, 2025' },
  { id: 'VRQ-0780', user: 'Marcus Lee', userId: 'USR-0318', type: 'Identity Document', typeBg: 'bg-[#A78BFA]/10', typeText: 'text-[#A78BFA]', status: 'Rejected', statusBg: 'bg-accent-red/10', statusText: 'text-accent-red', attempts: 2, attemptWarn: true, assigned: 'Verification Admin', date: 'Jul 2, 2025' },
  { id: 'VRQ-0764', user: 'Ngozi Obi', userId: 'USR-0427', type: 'Artist Portfolio', typeBg: 'bg-primary-green/10', typeText: 'text-primary-green', status: 'Pending', statusBg: 'bg-primary-blue/10', statusText: 'text-secondary-blue', attempts: 1, assigned: '—', date: 'Jun 30, 2025' },
  { id: 'VRQ-0751', user: 'Yemi Oladipo', userId: 'USR-0512', type: 'Business Reg.', typeBg: 'bg-accent-yellow/10', typeText: 'text-accent-yellow', status: 'Incomplete', statusBg: 'bg-accent-red/5', statusText: 'text-accent-red', attempts: 1, assigned: '—', date: 'Jun 25, 2025' },
  { id: 'VRQ-0740', user: 'Emeka Nwosu', userId: 'USR-0619', type: 'Selfie + ID', typeBg: 'bg-[#11EA9B]/10', typeText: 'text-[#11EA9B]', status: 'Expired', statusBg: 'bg-white/5', statusText: 'text-white/45', attempts: 3, attemptWarn: true, assigned: 'Verification Admin', date: 'May 18, 2025' },
];

const ITEMS_PER_PAGE = 5;

export default function VerificationDashboard({ 
  onViewDetails,
    onReviewDocument, 
    onViewAudit
  }: { 
    onViewDetails?: (id: string) => void;
    onReviewDocument?: (id: string) => void;
    onViewAudit?: () => void;
}) {
  // --- STATE ---
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // --- DERIVED DATA (Filtering) ---
    const filteredRequests = useMemo(() => {
      return REQUESTS.filter((req) => {
        // Search Filter
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          req.user.toLowerCase().includes(searchLower) ||
          req.userId.toLowerCase().includes(searchLower) ||
          req.status.toLowerCase().includes(searchLower);
  
        // Status Filter
        const matchesStatus = 
          statusFilter === "All" || 
          (statusFilter === "Incomplete" && (req.status === "Incomplete" || req.status === "Expired")) ||
          req.status === statusFilter;
  
        // Type Filter
        const matchesType = typeFilter === "All" || req.type === typeFilter;

        // Date Filter
        const matchesDate = dateFilter === "All" || req.date.includes(dateFilter.split(' ')[0]);
  
        return matchesSearch && matchesStatus && matchesType && matchesDate;
      });
    }, [searchTerm, statusFilter, typeFilter, dateFilter]);
  
    // --- DERIVED DATA (Pagination) ---
    const totalItems = filteredRequests.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
    const paginatedRequests = filteredRequests.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  
    // Reset to page 1 if filters change and the current page is now out of bounds
    useEffect(() => {
      if (currentPage > totalPages) {
        setCurrentPage(1);
      }
    }, [totalPages, currentPage]);
  
    // --- DERIVED DATA (Statistics) ---
    const dynamicStats: StatItem[] = [
      { label: 'Total Requests', value: REQUESTS.length, barColor: 'bg-white/10' },
      { label: 'Pending Review', value: REQUESTS.filter(r => r.status === 'Pending').length, barColor: 'bg-primary-blue' },
      { label: 'Under Review', value: REQUESTS.filter(r => r.status === 'Under Review').length, barColor: 'bg-accent-yellow' },
      { label: 'Approved', value: REQUESTS.filter(r => r.status === 'Approved').length, barColor: 'bg-primary-green' },
      { label: 'Rejected', value: REQUESTS.filter(r => r.status === 'Rejected').length, barColor: 'bg-accent-red' },
      { label: 'Expired / Incomplete', value: REQUESTS.filter(r => r.status === 'Expired' || r.status === 'Incomplete').length, barColor: 'bg-white/10' },
    ];
  
    const pendingCount = REQUESTS.filter(r => r.status === 'Pending').length;

  // --- COLUMNS ---
  const columns: Column<typeof REQUESTS[0]>[] = [
    {
      key: 'id',
      label: 'Request ID',
      render: (item) => (
        <div className="flex items-center gap-2 text-[#A78BFA] font-inter font-bold text-[11px] whitespace-nowrap">
          <div className="w-7 h-7 flex items-center justify-center bg-[#A78BFA]/10 rounded-lg shrink-0">
            <FileText size={12} />
          </div>
          {item.id}
        </div>
      )
    },
    {
      key: 'user',
      label: 'User',
      render: (item) => (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Avatar name={item.user} className="w-6.5 h-6.5 text-[9px]" />
          <span className="font-raleway font-bold text-[12px] text-white">{item.user}</span>
        </div>
      )
    },
    {
      key: 'userId',
      label: 'User ID',
      render: (item) => <span className="font-inter font-semibold text-[11px] text-secondary-blue whitespace-nowrap">{item.userId}</span>
    },
    {
      key: 'type',
      label: 'Verification Type',
      render: (item) => (
        <span className={`px-2.5 py-1 rounded-full font-inter font-semibold text-[10px] flex w-fit items-center gap-1 whitespace-nowrap ${item.typeBg} ${item.typeText}`}>
          <CheckCircle2 size={10} />
          {item.type}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (item) => (
        <span className={`px-2.5 py-1 rounded-full font-inter font-bold text-[11px] flex w-fit whitespace-nowrap ${item.statusBg} ${item.statusText}`}>
          {item.status}
        </span>
      )
    },
    {
      key: 'attempts',
      label: 'Attempts',
      render: (item) => (
        <div className="flex items-center gap-1 font-raleway font-bold text-[13px]">
          <span className={item.attemptWarn ? 'text-accent-yellow' : 'text-white'}>{item.attempts}</span>
          {item.attemptWarn && <AlertCircle size={10} className="text-accent-yellow" />}
        </div>
      )
    },
    {
      key: 'assigned',
      label: 'Assigned To',
      render: (item) => (
        <span className="font-inter text-[11px] text-white/45 whitespace-nowrap">
          {item.assigned === '—' ? '—' : <span className="text-white">{item.assigned}</span>}
        </span>
      )
    },
    {
      key: 'date',
      label: 'Date Submitted',
      render: (item) => <span className="font-inter text-[11px] text-white/45 whitespace-nowrap">{item.date}</span>
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (item) => (
        <div className="flex items-center gap-1">
          {/* View Details Button */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); onViewDetails?.(item.id); }}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/3 border border-white/10 rounded-md hover:bg-white/10 transition-colors group"
                    >
                      <FileText size={12} className="text-white/45 group-hover:text-white" />
                      <span className="font-inter font-medium text-[10px] text-white/45 group-hover:text-white transition-colors">Details</span>
                    </button>
                    
                    {/* Review Document Button */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); onReviewDocument?.(item.id); }}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 bg-primary-green/10 border border-primary-green/20 rounded-md hover:bg-primary-green/20 transition-colors group"
                    >
                      <ScanFace size={12} className="text-primary-green" />
                      <span className="font-inter font-bold text-[10px] text-primary-green">Review</span>
                    </button>
                  </div>
                )
              }
  ];

  return (
    <div className="flex flex-col items-start p-6 md:px-7 md:py-10 w-full min-h-screen font-sans overflow-x-hidden">
      
      <DashboardHeader data={filteredRequests}
      onViewAudit={onViewAudit}
      />
      
      <DashboardStatCards stats={dynamicStats} />
      
      <DashboardControls 
              searchTerm={searchTerm} 
              onSearchChange={setSearchTerm} 
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              typeFilter={typeFilter}
              onTypeFilterChange={setTypeFilter}
              dateFilter={dateFilter}       
              onDateFilterChange={setDateFilter}
            />
      
      <DashboardAlert pendingCount={pendingCount} />
      
      <div className="w-full max-w-400 mt-3.5">
        <Table 
          columns={columns} 
          data={paginatedRequests} 
          onRowClick={(item) => onViewDetails?.(item.id)} 
        />
        
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
          currentItemsCount={paginatedRequests.length} 
          totalItems={totalItems} 
          itemName="requests" 
        />
      </div>

    </div>
  );
}