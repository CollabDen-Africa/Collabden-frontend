"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const sampleData = [
  { name: "Mon", signups: 12, verifications: 8 },
  { name: "Tue", signups: 19, verifications: 14 },
  { name: "Wed", signups: 15, verifications: 11 },
  { name: "Thu", signups: 28, verifications: 20 },
  { name: "Fri", signups: 32, verifications: 25 },
  { name: "Sat", signups: 24, verifications: 18 },
  { name: "Sun", signups: 35, verifications: 30 },
];

export const AdminOverviewCharts: React.FC = () => {
  return (
    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">Platform Growth</h3>
          <p className="text-white/40 text-xs mt-0.5">Weekly signups & verification metrics</p>
        </div>
        <span className="px-3 py-1 bg-primary-green/10 text-primary-green text-xs font-semibold rounded-full border border-primary-green/20">
          Live Sync
        </span>
      </div>

      <div className="h-70 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sampleData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#73BF44" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#73BF44" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorVerif" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6495ED" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6495ED" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} />
            <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#101618",
                borderColor: "rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "#fff",
              }}
            />
            <Area type="monotone" dataKey="signups" stroke="#73BF44" fillOpacity={1} fill="url(#colorSignups)" />
            <Area type="monotone" dataKey="verifications" stroke="#6495ED" fillOpacity={1} fill="url(#colorVerif)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminOverviewCharts;
