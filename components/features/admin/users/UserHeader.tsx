import React from "react";
import Link from "next/link";
import { HiCheckCircle, HiMinusCircle, HiOutlinePencilSquare } from "react-icons/hi2";

export interface UserHeaderProps {
  user: any;
}

export const UserHeader: React.FC<UserHeaderProps> = ({ user }) => {
  const name = user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown';
  const initials = name.substring(0, 2).toUpperCase() || 'U';
  const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
  
  const tags = [];
  if (user.tier === 'PRO') tags.push({ label: 'Pro Plan', color: 'bg-purple-500/10 text-purple-400' });
  else if (user.tier === 'ELITE') tags.push({ label: 'Elite Plan', color: 'bg-yellow-500/10 text-yellow-500' });
  else tags.push({ label: 'Basic Plan', color: 'bg-white/10 text-white/60' });

  if (user.openToCollaborate) tags.push({ label: 'Open to Collaborate', color: 'bg-emerald-500/10 text-emerald-500' });
  
  if (user.skills && user.skills.length > 0) {
    tags.push({ label: user.skills.join(' • '), color: 'bg-emerald-500/10 text-emerald-500' });
  }

  return (
    <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="w-20 h-20 shrink-0 rounded-full bg-emerald-600/30 flex items-center justify-center text-2xl font-bold text-white border border-emerald-500/20">
          {initials}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{name}</h1>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase ${user.accountStatus === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
              {user.accountStatus}
            </span>
            {user.identityVerified ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <HiCheckCircle size={14} /> Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-white/5 text-white/40 border border-white/10">
                <HiMinusCircle size={14} /> Unverified
              </span>
            )}
          </div>
          
          <div className="text-sm text-white/40 flex flex-wrap items-center gap-2">
            <span>{user.email}</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>USR-{user.id.substring(user.id.length - 4).toUpperCase()}</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>Joined {joinDate}</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-1">
            {tags.map((t, idx) => (
              <span key={idx} className={`px-3 py-1 rounded-full text-xs font-medium ${t.color}`}>
                {t.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href={`/admin/users/${user.id}/moderate`}>
          <button className="px-5 py-2.5 rounded-xl border border-yellow-500/20 hover:bg-yellow-500/10 text-yellow-500 text-sm font-medium transition-colors flex items-center justify-center gap-2 w-full sm:w-auto">
            <HiOutlinePencilSquare size={18} />
            Suspend Account
          </button>
        </Link>
        <button className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 text-sm font-medium transition-colors flex items-center justify-center gap-2">
          <HiOutlinePencilSquare size={18} />
          Add Note
        </button>
      </div>
    </div>
  );
};
