import React from 'react';
import { Lock } from 'lucide-react';
import { ExportCSVButton } from '@/components/ui/ExportCSVButton';

interface AuditHeaderProps {
  data: any[];
  csvHeaders: { label: string; key: string }[];
}

export default function AuditHeader({ data, csvHeaders }: AuditHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start w-full max-w-300 min-h-17.5 gap-4 md:gap-0">
      <div className="flex flex-col w-full max-w-[519.42px]">
        <h1 className="font-raleway font-bold text-[20px] leading-7.5 text-white">
          Verification Audit Log
        </h1>
        <p className="font-raleway text-[12px] leading-4.5 text-white/45 mt-1 max-w-150">
          All administrative actions performed on verification requests are permanently logged and cryptographically sealed.
        </p>
      </div>

      <div className="flex flex-row items-center gap-2.5 w-full md:w-auto h-auto md:h-[55.6px] shrink-0 mt-2 md:mt-0">
        <div className="flex items-center gap-1.5 px-3.5 py-2 h-[55.6px] bg-primary-blue/4 border-[0.8px] border-primary-blue/20 rounded-[10px]">
          <Lock size={11} className="text-secondary-blue" />
          <span className="font-inter font-semibold text-[11px] leading-4 text-secondary-blue whitespace-nowrap">
            Read-Only · Immutable
          </span>
        </div>

        <ExportCSVButton 
          data={data} 
          headers={csvHeaders} 
          filename="Verification_Audit_Log.csv" 
          className="text-white/45 font-raleway font-semibold text-[12px] whitespace-nowrap shrink-0"
        />
      </div>
    </div>
  );
}