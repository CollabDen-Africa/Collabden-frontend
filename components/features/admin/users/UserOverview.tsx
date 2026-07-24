import React from "react";

interface UserOverviewProps {
  user: any;
  name: string;
  verifiedOn: string;
}

const InfoCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="bg-[#121415] border border-white/5 rounded-2xl p-6 flex flex-col gap-5">
    <h3 className="text-[11px] font-bold text-white/40 uppercase tracking-widest">{title}</h3>
    <div className="flex flex-col gap-4">
      {children}
    </div>
  </div>
);

const InfoRow = ({ label, value, valueClassName = "text-white font-medium" }: { label: string, value: React.ReactNode, valueClassName?: string }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-white/40">{label}</span>
    <span className={valueClassName}>{value}</span>
  </div>
);

export const UserOverview: React.FC<UserOverviewProps> = ({ user, name, verifiedOn }) => {
  return (
    <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-[#0a0a0c]">
      {/* Column 1 */}
      <InfoCard title="Personal Info">
        <InfoRow label="Full Name" value={name} />
        <InfoRow label="Email" value={user.email} />
        <InfoRow label="Username" value={`@${user.displayName || user.firstName?.toLowerCase() || 'user'}`} />
        <InfoRow label="Phone" value={user.phoneNumber || 'Not provided'} />
        <InfoRow label="Location" value="Not specified" />
        <InfoRow label="Stage Name" value={user.displayName || 'None'} />
      </InfoCard>

      {/* Column 2 */}
      <div className="flex flex-col gap-6">
        <InfoCard title="Subscription">
          <InfoRow 
            label="Plan" 
            value={user.tier === 'PRO' ? 'Pro' : user.tier === 'ELITE' ? 'Elite' : 'Free'}
            valueClassName={user.tier === 'PRO' ? 'text-purple-400 font-medium' : 'text-white font-medium'} 
          />
          <InfoRow label="Status" value="Active" valueClassName="text-emerald-500 font-medium" />
          <InfoRow label="Billing" value={user.tier === 'PRO' ? '$19.99 / month' : 'Free'} />
          <InfoRow label="Next Renewal" value="-" />
        </InfoCard>

        <InfoCard title="Verification">
          <InfoRow 
            label="Status" 
            value={user.identityVerified ? 'Verified' : 'Unverified'}
            valueClassName={user.identityVerified ? 'text-emerald-500 font-medium' : 'text-white/60 font-medium'} 
          />
          <InfoRow label="Verified On" value={user.identityVerified ? verifiedOn : '-'} />
          <InfoRow label="Reviewed By" value={user.identityVerified ? 'System' : '-'} />
        </InfoCard>
      </div>
   
      {/* Column 3 */}
      <InfoCard title="Collaboration Summary">
        <InfoRow label="Projects Created" value={user._count?.ownedProjects || 0} valueClassName="text-[#72c043] font-bold" />
        <InfoRow label="Projects Joined" value={user._count?.collaborations || 0} valueClassName="text-blue-400 font-bold" />
        <InfoRow label="Active Projects" value="0" valueClassName="text-emerald-500 font-bold" />
        <InfoRow label="Completed" value="0" valueClassName="text-white/60 font-bold" />
        <InfoRow label="Avg Rating" value="0.0 ★" valueClassName="text-yellow-500 font-bold" />
        <InfoRow label="Earnings (total)" value={`$${user.wallet?.totalEarned || '0'}`} valueClassName="text-emerald-500 font-bold" />
      </InfoCard>
    </div>
  );
};
