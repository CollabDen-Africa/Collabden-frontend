"use client";
import { FiArrowLeft, FiArrowDownRight, FiArrowUpRight, FiSearch, FiFilter } from "react-icons/fi";
import Button from "@/components/ui/Button";

interface TransactionsViewProps {
  onBack?: () => void;
}

const TRANSACTIONS = [
  { id: "TRX-1094", date: "Jul 21, 2026", description: "Escrow Payout - Chinedu Okafor", type: "out", amount: 1200000, status: "Completed" },
  { id: "TRX-1093", date: "Jul 18, 2026", description: "Escrow Payout - Amara Nwosu", type: "out", amount: 600000, status: "Completed" },
  { id: "TRX-1092", date: "Jul 10, 2026", description: "Escrow Payout - Samuel Okeke", type: "out", amount: 400000, status: "Completed" },
  { id: "TRX-1091", date: "Jul 01, 2026", description: "Escrow Funding Deposit", type: "in", amount: 5075000, status: "Completed" },
  { id: "TRX-1090", date: "Jun 28, 2026", description: "Wallet Top-up via Bank Transfer", type: "in", amount: 6000000, status: "Completed" },
];

export default function TransactionsView({ onBack }: TransactionsViewProps) {
  const formatAmount = (amount: number) => `₦${amount.toLocaleString()}`;

  return (
    <div className="w-full min-h-screen relative overflow-x-hidden p-5 flex flex-col">
      
      <div className="relative z-10 w-full max-w-287.5 mx-auto flex flex-col h-full">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10">
          <div className="flex flex-col sm:flex-start items-start gap-6">
            <Button 
              variant="ghost" 
              onClick={onBack} 
              className="w-auto h-1 flex items-center justify-center border border-white/2 hover:border-white/10"
            >
              <FiArrowLeft size={20} className="text-white" />
            </Button>
            <div className="flex flex-col gap-1">
              <h1 className="font-raleway font-black text-[24px] text-white tracking-[-0.6px]">
                Transaction History
              </h1>
              <p className="font-raleway font-normal text-[14px] text-text-muted">
                View all wallet funding, escrow locks, and collaborator payouts.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2.5">
              <FiSearch className="text-text-muted/80 mr-2.5" size={16} />
              <input 
                type="text" 
                placeholder="Search transactions..." 
                className="bg-transparent border-none outline-none text-white text-[14px] font-raleway w-full sm:w-50"
              />
            </div>
            <Button variant="ghost" className="border border-white/10 rounded-full px-[16px] py-[10px] flex items-center justify-center" icon={FiFilter} iconPosition="left">
              Filter
            </Button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="w-full bg-black/15 border border-white/5 rounded-6 md:rounded-[30px] flex flex-col backdrop-blur-md overflow-hidden">
                  
                  {/* Scrollable Container for Mobile */}
                  <div className="w-full overflow-x-auto custom-scrollbar p-4 md:p-6">
                    <div className="min-w-200 flex flex-col">


                      {/* Table Header */}
                                    <div className="grid grid-cols-5 pb-4 mb-4 border-b border-white/10 px-4">
                                      <span className="font-raleway font-semibold text-[11px] md:text-[12px] text-text-muted/90 uppercase tracking-[1px] col-span-2">Description</span>
                                      <span className="font-raleway font-semibold text-[11px] md:text-[12px] text-text-muted/90 uppercase tracking-[1px]">Date</span>
                                      <span className="font-raleway font-semibold text-[11px] md:text-[12px] text-text-muted/90 uppercase tracking-[1px]">Amount</span>
                                      <span className="font-raleway font-semibold text-[11px] md:text-[12px] text-text-muted/90 uppercase tracking-[1px] text-right">Status</span>
                                    </div>

          <div className="flex flex-col gap-2">
            {TRANSACTIONS.map((trx) => (
              <div key={trx.id} className="grid grid-cols-5 items-center bg-white/5 hover:bg-white/10 transition-colors rounded-[20px] p-4">
                
                {/* Description & Icon */}
                <div className="col-span-2 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border
                    ${trx.type === 'in' ? 'bg-primary-green/10 border-primary-green/20 text-primary-green' : 'bg-primary-blue/10 border-primary-blue/20 text-secondary-blue'}
                  `}>
                    {trx.type === 'in' ? <FiArrowDownRight size={18} /> : <FiArrowUpRight size={18} />}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-raleway font-bold text-[15px] text-white">{trx.description}</span>
                    <span className="font-raleway font-normal text-[12px] text-text-muted/90">{trx.id}</span>
                  </div>
                </div>

                {/* Date */}
                <span className="font-raleway font-normal text-[14px] text-white/70">{trx.date}</span>

                {/* Amount */}
                <span className={`font-raleway font-bold text-[15px] ${trx.type === 'in' ? 'text-primary-green' : 'text-white'}`}>
                  {trx.type === 'in' ? '+' : '-'}{formatAmount(trx.amount)}
                </span>

                {/* Status */}
                <div className="text-right">
                  <span className="inline-flex items-center justify-center bg-primary-green/10 text-primary-green border border-primary-green/20 px-3 py-1 rounded-full font-raleway font-semibold text-[11px] uppercase tracking-[0.5px]">
                    {trx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          </div>
          </div>

        </div>

      </div>
    </div>
  );
}