"use client";

import { FiArrowLeft, FiArrowDownRight, FiArrowUpRight, FiSearch, FiFilter } from "react-icons/fi";
import Button from "@/components/ui/Button";
import { usePayment } from "@/hooks/payment/usePayment";

interface TransactionsViewProps {
  onBack?: () => void;
}


export default function TransactionsView({ onBack }: TransactionsViewProps) {
  const { useTransactions } = usePayment();
  const { data: txData, isLoading } = useTransactions();
    
  const transactions = txData?.transactions || [];
  
  const formatAmount = (amount: number) => ` ${amount.toLocaleString()}`;

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
            <Button variant="ghost" className="border border-white/10 rounded-full px-4 py-2.5 flex items-center justify-center" icon={FiFilter} iconPosition="left">
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
                {isLoading ? (
                  <div className="py-10 text-center text-white/50">Loading transactions...</div>
                ) : transactions.length === 0 ? (
                  <div className="py-10 text-center text-white/50">No transactions found.</div>
                ) : (
                  transactions.map((trx: any) => {
                    // Logic to determine if money is flowing IN to user wallet or OUT (Escrow/Withdrawal)
                    const isCredit = trx.type === "FUNDING" || trx.type === "ESCROW_CREDIT";
                              
                    return (
                      <div key={trx.id} className="grid grid-cols-5 items-center bg-white/5 hover:bg-white/10 transition-colors rounded-[20px] p-4">
                
                        {/* Description & Icon */}
                        <div className="col-span-2 flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border
                    ${isCredit ? 'bg-primary-green/10 border-primary-green/20 text-primary-green' : 'bg-primary-blue/10 border-primary-blue/20 text-secondary-blue'}
                  `}>
                            {isCredit ? <FiArrowDownRight size={18} /> : <FiArrowUpRight size={18} />}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-raleway font-bold text-[15px] text-white">{trx.description || trx.type}</span>
                            <span className="font-raleway font-normal text-[12px] text-text-muted/90">{trx.reference || trx.id.substring(0, 8)}</span>
                          </div>
                        </div>

                        {/* Date */}
                        <span className="font-raleway font-normal text-[14px] text-white/70">{new Date(trx.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>

                        {/* Amount */}
                        <span className={`font-raleway font-bold text-[15px] ${isCredit ? 'text-primary-green' : 'text-white'}`}>
                          {isCredit ? '+' : '-'}{formatAmount(trx.amount)}
                        </span>

                        {/* Status */}
                        <div className="text-right">
                          <span className={`inline-flex items-center justify-center bg-primary-green/10 text-primary-green border border-primary-green/20 px-3 py-1 rounded-full font-raleway font-semibold text-[11px] uppercase tracking-[0.5px] ${trx.status === 'COMPLETED' ? 'bg-primary-green/10 text-primary-green border-primary-green/20' : trx.status === 'PENDING' ? 'bg-accent-yellow/10 text-accent-yellow border-accent-yellow/20' :
                            'bg-red-500/10 text-red-400 border-red-500/20'
                            }`}>
                            {trx.status}
                          </span>
                        </div>
                      </div>
                    )
                  })
                )}
          </div>
          </div>
          </div>

        </div>

      </div>
    </div>
  );
}