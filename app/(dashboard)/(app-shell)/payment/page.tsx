"use client";

import React, { useMemo } from "react";
import { FiTrendingUp, FiClock, FiAward, FiArrowDownLeft } from "react-icons/fi";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { usePayment } from "@/hooks/payment/usePayment";

export default function PaymentsOverviewPage() {
  const { useWallet, useTransactions } = usePayment();
  
  const { data: wallet } = useWallet();
  const { data: txData } = useTransactions(undefined, undefined, 1, 50);
  const transactions = txData?.transactions || [];

  // Dynamically compute balances based on transaction history
  const calculatedMetrics = useMemo(() => {
    let pending = 0;
    let earnings = 0;
    let withdrawn = 0;

    transactions.forEach((tx) => {
      const amount = Number(tx.amount) || 0;
      if (tx.status === "PENDING") {
        pending += amount;
      }
      if (tx.status === "COMPLETED") {
        if (tx.type === "FUNDING" || tx.type === "ESCROW_CREDIT") {
          earnings += amount;
        } else if (tx.type === "WITHDRAWAL" || tx.type === "ESCROW_DEBIT") {
          withdrawn += amount;
        }
      }
    });

    return { pending, earnings, withdrawn };
  }, [transactions]);

  const KPI_DATA = useMemo(() => {
    const balance = wallet?.balance || 0;
    const currency = wallet?.currency || "NGN";

    const format = (val: number) => {
      return `${currency} ${Number(val).toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    };

    return [
      { id: "available", title: "Available Balance", amount: format(balance), subtitle: "Available for withdrawal", icon: <FiTrendingUp size={16} />, theme: "primary" },
      { id: "pending", title: "Pending Balance", amount: format(calculatedMetrics.pending), subtitle: "In escrow & processing", icon: <FiClock size={16} />, theme: "glass" },
      { id: "earnings", title: "Total Earnings", amount: format(calculatedMetrics.earnings), subtitle: "All-time income received", icon: <FiAward size={16} />, theme: "glass" },
      { id: "withdrawn", title: "Total Withdrawn", amount: format(calculatedMetrics.withdrawn), subtitle: "Successfully withdrawn funds", icon: <FiArrowDownLeft size={16} />, theme: "glass" }
    ];
  }, [wallet, calculatedMetrics]);

  // Aggregate monthly revenues from completed transactions for charting
  const chartData = useMemo(() => {
    const monthlyMap: Record<string, number> = {
      Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0,
      Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0
    };

    transactions
      .filter((tx) => tx.status === "COMPLETED" && (tx.type === "FUNDING" || tx.type === "ESCROW_CREDIT"))
      .forEach((tx) => {
        const date = new Date(tx.createdAt);
        const monthName = date.toLocaleString("en-US", { month: "short" });
        if (monthName in monthlyMap) {
          monthlyMap[monthName] += Number(tx.amount) || 0;
        }
      });

    // Return last 6 months dynamically (simplified here to Jan-Jun matching default view)
    return [
      { month: "Jan", revenue: monthlyMap.Jan },
      { month: "Feb", revenue: monthlyMap.Feb },
      { month: "Mar", revenue: monthlyMap.Mar },
      { month: "Apr", revenue: monthlyMap.Apr },
      { month: "May", revenue: monthlyMap.May },
      { month: "Jun", revenue: monthlyMap.Jun },
    ];
  }, [transactions]);

  const totalRevenue = useMemo(() => {
    const sum = chartData.reduce((acc, curr) => acc + curr.revenue, 0);
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: wallet?.currency || "NGN",
      minimumFractionDigits: 0,
    }).format(sum);
  }, [chartData, wallet]);

  return (
    <div className="flex flex-col w-full">
      {/* KPI CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px] w-full mb-[60px] px-[20px] lg:px-0">
        {KPI_DATA.map((kpi) => (
          <div 
            key={kpi.id}
            className={`relative overflow-hidden rounded-[30px] lg:rounded-[40.38px] p-[24px] flex flex-col justify-between min-h-[176px] transition-transform hover:scale-[1.02] border shadow-lg ${
              kpi.theme === 'primary' 
                ? 'bg-primary-green border-primary-green shadow-primary-green/20' 
                : 'bg-black/10 border-white/20 backdrop-blur-xl shadow-primary-green/5' 
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between z-10 w-full text-white">
              <span className="font-normal text-[14px] lg:text-[16px] leading-[22px]">
                {kpi.title}
              </span>
              <div className={`w-[28px] h-[28px] rounded-[10px] flex items-center justify-center backdrop-blur-sm ${kpi.theme === 'primary' ? 'bg-black/10 text-white' : 'bg-primary-blue/10 text-white'}`}>
                {kpi.icon}
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-[8px] z-10 mt-4 lg:mt-0 text-white">
              <span className="font-semibold text-[24px] lg:text-[26px] leading-[32px] tracking-tight truncate">
                {kpi.amount}
              </span>
              <span className={`font-normal text-[13px] lg:text-[14px] leading-[20px] ${kpi.theme === 'primary' ? 'text-white/90' : 'text-white/85'}`}>
                {kpi.subtitle}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* CHART AREA */}
      <div className="w-full flex flex-col gap-[30px] bg-black/10 border border-white/20 backdrop-blur-lg rounded-[30px] p-[20px] lg:p-[40px] shadow-xl shadow-primary-green/5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between w-full gap-4 lg:gap-0">
          <div className="flex flex-col gap-[4px]">
            <h3 className="font-inter font-semibold text-[18px] leading-[28px] text-primary-green">Earnings Trend</h3>
            <p className="font-raleway font-normal text-[14px] leading-[20px] text-white/60">Last 6 months performance</p>
          </div>
          
          <div className="flex items-center gap-[8px] bg-white/20 px-4 py-2 rounded-full border border-white/50 shadow-sm">
            <span className="font-raleway font-normal text-[14px] leading-[20px] text-white">Total Chart Earnings:</span>
            <span className="font-raleway font-semibold text-[14px] leading-[20px] text-primary-green">{totalRevenue}</span>
          </div>
        </div>

        <div className="w-full h-[300px] lg:h-[400px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 20 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#73BF44" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#73BF44" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="5 5" vertical={true} horizontal={true} stroke="rgba(255, 255, 255, 0.05)" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 14, fontFamily: 'Raleway' }} dy={15}/>
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 14, fontFamily: 'Raleway' }} tickFormatter={(val) => `₦${val / 1000}k`} dx={-10}/>
              
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(12px)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF' }}
                itemStyle={{ color: '#73BF44', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#73BF44" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}