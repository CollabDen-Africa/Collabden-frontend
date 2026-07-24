import React from 'react';
import { HiOutlineDownload } from 'react-icons/hi';

interface ExportCSVButtonProps {
  data: any[];
  filename?: string;
  headers?: { label: string; key: string }[];
  className?: string;
  disabled?: boolean;
}

export const ExportCSVButton: React.FC<ExportCSVButtonProps> = ({
  data,
  filename = 'export.csv',
  headers,
  className,
  disabled = false,
}) => {
  const downloadCSV = () => {
    if (!data || !data.length) return;

    let csvContent = '';

    // Generate headers
    const csvHeaders = headers ? headers.map(h => h.label) : Object.keys(data[0]);
    csvContent += csvHeaders.join(',') + '\n';

    // Generate rows
    data.forEach(row => {
      const rowData = headers
        ? headers.map(h => {
            let value = row[h.key];
            if (value === null || value === undefined) value = '';
            
            const stringValue = String(value).replace(/"/g, '""');
            return `"${stringValue}"`;
          })
        : Object.values(row).map(value => {
            if (value === null || value === undefined) value = '';
            const stringValue = String(value).replace(/"/g, '""');
            return `"${stringValue}"`;
          });
      csvContent += rowData.join(',') + '\n';
    });

    // Create a blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    // Create an object URL for the blob
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={downloadCSV}
      disabled={disabled || !data || data.length === 0}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors w-fit disabled:opacity-50 disabled:cursor-not-allowed ${className || ''}`}
    >
      <HiOutlineDownload size={18} />
      Export CSV
    </button>
  );
};
