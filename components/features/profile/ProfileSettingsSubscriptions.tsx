"use client";

{/* Note to self -> Unless designer changes it, consider making a subscription plan design. Also add empty state */}

import React from "react";
import Button from "@/components/ui/Button";
import { FiCreditCard, FiDownload, FiHardDrive } from "react-icons/fi";

const INVOICES = [
  { id: "INV-2026-061", date: "Jun 1, 2026", amount: "$29.00", status: "Paid" },
  { id: "INV-2026-051", date: "May 1, 2026", amount: "$29.00", status: "Paid" },
  { id: "INV-2026-041", date: "Apr 1, 2026", amount: "$29.00", status: "Paid" },
];

export default function ProfileSettingsSubscriptions() {
  return (
    <div className="flex flex-col w-full flex-1 gap-8.75 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="font-raleway font-semibold text-[26.4px] leading-8.5 text-[#E8EDF0]">
          Subscription & Billing
        </h1>
        <p className="font-raleway font-normal text-[20.5px] leading-7.25 text-white/50">
          Manage your plan, usage, and payment details
        </p>
      </div>

      {/* Current Plan Card */}
      <div className="w-full bg-white/5 border border-border-muted/20 rounded-[35px] p-8.75 flex flex-col backdrop-blur-md">
        
        {/* Top Row: Plan info & Badge */}
        <div className="flex flex-row justify-between items-start w-full">
          <div className="flex flex-col">
            <span className="font-raleway font-semibold text-[17.6px] text-primary-green mb-1.5">
              Studio Plan
            </span>
            <span className="font-raleway font-bold text-[35.2px] text-white leading-none mb-1.5">
              $29/mo
            </span>
            <span className="font-raleway font-normal text-[17.6px] text-white/50">
              Renews July 1, 2026 · Annual billing
            </span>
          </div>
          
          <div className="flex items-center gap-4 bg-accent-green-bright/5 border border-border-muted/25 rounded-full px-4 py-1.5">
            <div className="w-[8.8px] h-[8.8px] bg-accent-green-success rounded-full shadow-[0_0_8px_rgba(115,191,68,0.8)]" />
            <span className="font-raleway font-normal text-[17.6px] text-primary-green">Active</span>
          </div>
        </div>

        {/* Storage Bar */}
        <div className="flex flex-col w-full mt-6">
          <div className="flex justify-between items-center mb-3">
            <div className="flex">
              <div className="flex px-2  items-center shrink-0">
                <FiHardDrive size={18} className="text-text-muted" />
              </div>
              <span className="font-raleway font-normal text-[17.6px] text-white/50">Storage</span>
            </div>
            <span className="font-raleway font-normal text-[17.6px] text-white/80">72 gb / 100 gb</span>
          </div>
          <div className="w-full h-[11.7px] bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-primary-green rounded-full w-[72%]" />
          </div>
        </div>

        {/* Plan Actions */}
        <div className="flex flex-row flex-wrap gap-4 mt-8">
          <Button variant="primary" className="rounded-full px-6 py-3 h-auto text-[20.5px]">
            Upgrade Plan
          </Button>
          <Button variant="outline" className="rounded-full px-6 py-3 h-auto text-[20.5px] text-white/90! border-border-muted/50!">
            Manage Payment
          </Button>
          <Button variant="ghost" className="rounded-full px-6 py-3 h-auto text-[20.5px] text-text-muted! ml-auto">
            Cancel Plan
          </Button>
        </div>
      </div>

      {/* Payment Method Card */}
      <div className="w-full bg-white/5 border border-white/10 rounded-3xl p-7 flex flex-row items-center gap-6 backdrop-blur-md">
        <div className="w-[58.6px] h-[58.6px] bg-primary-blue rounded-3xl flex items-center justify-center shrink-0">
          <FiCreditCard size={26} className="text-white" />
        </div>
        
        <div className="flex flex-col flex-1">
          <span className="font-raleway font-medium text-[20.5px] text-text-muted">
            Visa ending in 4242
          </span>
          <span className="font-raleway font-normal text-[17.6px] text-white/50">
            Expires 08/2028
          </span>
        </div>

        <Button variant="outline" className="rounded-[18px] px-5 py-2 h-auto text-[17.6px] text-accent-soft-blue/50! border-white/10">
          Update
        </Button>
      </div>

      {/* Billing History Card */}
      <div className="w-full bg-white/5 border border-white/10 rounded-3xl flex flex-col backdrop-blur-md overflow-hidden">
        
        {/* Table Header */}
        <div className="flex justify-between items-center px-8.75 py-6 border-b-[1.6px] border-white/5">
          <span className="font-raleway font-medium text-[20.5px] text-white">
            Billing History
          </span>
          <button className="font-raleway font-medium text-[17.6px] text-primary-green hover:brightness-110 transition-all">
            View All
          </button>
        </div>

        {/* Invoice Rows */}
        <div className="flex flex-col w-full">
          {INVOICES.map((invoice, index) => (
            <div 
              key={invoice.id} 
              className={`flex flex-row items-center justify-between px-8.75 py-6 ${
                index !== INVOICES.length - 1 ? "border-b-[1.6px] border-white/5" : ""
              }`}
            >
              <div className="flex flex-col gap-1 flex-1">
                <span className="font-raleway font-normal text-[20.5px] text-white/90">
                  {invoice.date}
                </span>
                <span className="font-raleway font-normal text-[17.6px] text-text-muted">
                  {invoice.id}
                </span>
              </div>
              
              <div className="flex items-center gap-6">
                <span className="font-raleway font-medium text-[20.5px] text-white/85">
                  {invoice.amount}
                </span>
                
                <div className="bg-card-bg/50 rounded-full px-3 py-1">
                  <span className="font-raleway font-normal text-[17.6px] text-primary-green">
                    {invoice.status}
                  </span>
                </div>
                
                <button className="flex items-center gap-1.5 text-text-muted hover:text-white transition-colors ml-3">
                  <FiDownload size={18} />
                  <span className="font-raleway font-medium text-[17.6px]">PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}