import React from 'react';
import { AlertCircle } from 'lucide-react';

interface DashboardAlertProps {
  pendingCount: number;
}

export default function DashboardAlert({ pendingCount }: DashboardAlertProps) {
  if (pendingCount <= 0) return null;

  return (
    <div className="flex items-center gap-2.5 w-full max-w-242.5 px-4 py-2.75 mt-4 bg-accent-yellow/4 border border-accent-yellow/20 rounded-xl">
      <AlertCircle size={14} className="text-accent-yellow" />
      <span className="font-raleway font-bold text-[12px] text-accent-yellow">
        {pendingCount} pending requests are awaiting assignment and review
      </span>
    </div>
  );
}