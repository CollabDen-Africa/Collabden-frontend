import React from 'react';
import { ExportCSVButton } from '@/components/ui/ExportCSVButton';
import { FileText } from 'lucide-react';

interface DashboardHeaderProps {
  data: any[];
  onViewAudit?: () => void;
}

export default function DashboardHeader({ data, onViewAudit }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start w-full max-w-400 gap-4">
      <div className="flex flex-col">
        <h1 className="font-raleway font-bold text-[20px] text-white">Verification Management</h1>
        <p className="font-raleway text-[12px] text-white/45 mt-1">
          Review identity verification requests and manage users
        </p>
      </div>

      {/* Header Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto shrink-0">
              
              {/* Audit Log Button */}
              {onViewAudit && (
                <button 
                  onClick={onViewAudit}
                  className="flex items-center justify-center gap-2 h-9 px-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors w-full sm:w-auto shrink-0"
                >
                  <FileText size={12} className="text-white/80" />
                  <span className="font-raleway font-bold text-[12px] text-white/80 whitespace-nowrap">Audit Log</span>
                </button>
              )}
      <ExportCSVButton 
        data={data} 
        filename="Verification_Requests_Export.csv"
        className="w-full sm:w-auto flex justify-center items-center shrink-0 px-4 py-2 rounded-full text-white/60 font-raleway text-[12px]"
      />
      </div>

    </div>
  );
}