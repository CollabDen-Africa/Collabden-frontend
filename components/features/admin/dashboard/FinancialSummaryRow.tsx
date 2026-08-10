"use client";

import React from "react";

interface FinancialSummaryRowProps {
  isLoading?: boolean;
}

export const FinancialSummaryRow: React.FC<FinancialSummaryRowProps> = ({
  isLoading = false,
}) => {
  const financialCards = [
    { label: "Total Escrow Volume (MTD)", value: "$631,450" },
    { label: "Withdrawals Processed", value: "$198,200" },
    { label: "Subscription Revenue (MTD)", value: "$42,880" },
    { label: "Pending Releases", value: "$27,140" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {financialCards.map((card, idx) => (
        <div
          key={idx}
          className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col justify-between"
        >
          <span className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">
            {card.label}
          </span>
          <div className="text-2xl font-bold font-sans tracking-tight text-white mb-3">
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-primary-green border-t-transparent rounded-full animate-spin" />
            ) : (
              card.value
            )}
          </div>
          <div className="h-1 w-full rounded-full bg-primary-green/30 overflow-hidden">
            <div className="h-full bg-primary-green w-3/4 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FinancialSummaryRow;
