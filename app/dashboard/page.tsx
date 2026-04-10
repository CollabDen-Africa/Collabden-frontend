"use client";

import { ROUTES } from "@/constants/routes";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { HiLogout } from "react-icons/hi";

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-green/30 border-t-primary-green rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 font-medium">
              Welcome back, <span className="text-primary-green">{user?.email?.split('@')[0] || 'User'}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href={ROUTES.HOME}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-semibold"
            >
              Go Home
            </Link>
            
            <button
              onClick={() => logout()}
              className="flex items-center gap-2 px-6 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all font-semibold"
            >
              <HiLogout size={20} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-48 animate-pulse flex items-center justify-center">
               <div className="text-gray-300 font-medium uppercase tracking-widest text-xs">Analytics Card {i}</div>
            </div>
          ))}
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-96 flex flex-col items-center justify-center space-y-4">
            <div className="w-20 h-20 bg-primary-green/10 rounded-full flex items-center justify-center text-primary-green">
              <span className="text-3xl font-bold">{user?.email?.[0]?.toUpperCase() || 'U'}</span>
            </div>
            <div className="text-center">
              <p className="text-gray-900 font-bold text-xl">Collaborator</p>
              <p className="text-gray-400 font-medium">{user?.email || 'email@example.com'}</p>
            </div>
            <p className="text-gray-400 font-medium mt-6">Your CollabDen dashboard is ready!</p>
        </div>
      </div>
    </div>
  );
}
