import React, { useState } from 'react';
import {
  CreditCard,
  AlertCircle,
  ChevronDown,
  Receipt,
  ArrowDownToLine,
  Landmark,
  Hash,
  Smartphone,
  Bitcoin,
  ArrowRight
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { SectionCard } from '@/components/ui/SectionCard';
import { SharedToggleRow } from '@/components/ui/SharedToggleRow';
import Toggle from '@/components/ui/Toggle';

export default function PlatformSettingsPayments({ onTriggerConfirm }: { onTriggerConfirm: (payload: any) => void }) {
  const [paymentConfig, setPaymentConfig] = useState({
      marketplaceFee: '10%',
      escrowFee: '2.5%',
      subShare: '0% (flat-rate plan)',
      disputeFee: '₦500 flat',
      minWithdrawal: '₦5,000',
      maxWithdrawal: '₦2,000,000',
      dailyLimit: '₦5,000,000',
      processingTime: '1–3 business days'
    });
  // Centralized state for all toggles
  const [toggles, setToggles] = useState({
    // Withdrawal Limits & Thresholds
    bankVerified: true,
    holdNewSeller: true,
    bulkWithdraw: false,
    // Supported Payment Methods
    cardPayments: true,
    bankTransfer: true,
    ussd: true,
    mobileMoney: false,
    crypto: false,
  });

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleConfigChange = (key: keyof typeof paymentConfig, value: string) => {
      setPaymentConfig(prev => ({ ...prev, [key]: value }));
    };
  
    const handleReview = () => {
      onTriggerConfirm({
        changes: [
          { label: 'Marketplace Service Fee', oldValue: '8%', newValue: paymentConfig.marketplaceFee },
          { label: 'Minimum Withdrawal Amount', oldValue: '₦2,000', newValue: paymentConfig.minWithdrawal }
        ]
      });
    };

  const renderIcon = (IconComp: any, theme: 'teal' | 'blue' | 'purple' = 'teal') => {
      const themes = {
        teal: "text-[#11EA9B] bg-[#11EA9B]/10 border-[#11EA9B]/20",
        blue: "text-[#6FA3E0] bg-[#6FA3E0]/10 border-[#6FA3E0]/20",
        purple: "text-[#A78BFA] bg-[#A78BFA]/10 border-[#A78BFA]/20"
      };
      return (
        <div className={`flex justify-center items-center w-9 h-9 border rounded-xl ${themes[theme].split(' ').slice(1).join(' ')}`}>
          <IconComp className={`w-4.25 h-4.25 ${themes[theme].split(' ')[0]}`} />
        </div>
      );
    };
  
    return (
      <div className="flex flex-col gap-4.5 w-full">
        <SectionCard icon={renderIcon(Receipt)} title="Platform Transaction Fees" subtitle="Fees applied to marketplace transactions and escrow services">
          <div className="flex flex-row items-start p-3 gap-2.5 w-full bg-accent-yellow/4 border border-accent-yellow/20 rounded-xl mb-4 mt-2">
            <AlertCircle className="w-3.5 h-3.5 text-accent-yellow shrink-0 mt-0.5" />
            <p className="text-xs text-accent-yellow leading-relaxed">Changing transaction fees affects all new transactions. Existing active escrows retain their original fee structure.</p>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <SelectField label="Marketplace Service Fee" value={paymentConfig.marketplaceFee} options={['5%', '8%', '10%', '12%']} onChange={(e) => handleConfigChange('marketplaceFee', e.target.value)} />
            <SelectField label="Escrow Processing Fee" value={paymentConfig.escrowFee} options={['1.5%', '2.0%', '2.5%', '3.0%']} onChange={(e) => handleConfigChange('escrowFee', e.target.value)} />
            <SelectField label="Platform Subscription Share" value={paymentConfig.subShare} options={['0% (flat-rate plan)', '5%']} onChange={(e) => handleConfigChange('subShare', e.target.value)} />
            <SelectField label="Dispute Resolution Fee" value={paymentConfig.disputeFee} options={['Free', '₦500 flat', '₦1,000 flat']} onChange={(e) => handleConfigChange('disputeFee', e.target.value)} />
          </div>
        </SectionCard>
  
        <SectionCard icon={renderIcon(ArrowDownToLine, 'blue')} title="Withdrawal Limits & Thresholds" subtitle="Configure payout eligibility and limits for sellers on the platform">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-4 mt-2">
              <SelectField label="Minimum Withdrawal Amount" value={paymentConfig.minWithdrawal} options={['₦2,000', '₦5,000', '₦10,000']} onChange={(e) => handleConfigChange('minWithdrawal', e.target.value)} />
              <SelectField label="Maximum Single Withdrawal" value={paymentConfig.maxWithdrawal} options={['₦1,000,000', '₦2,000,000', 'No Limit']} onChange={(e) => handleConfigChange('maxWithdrawal', e.target.value)} />
              <SelectField label="Daily Withdrawal Limit" value={paymentConfig.dailyLimit} options={['₦2,000,000', '₦5,000,000', 'No Limit']} onChange={(e) => handleConfigChange('dailyLimit', e.target.value)} />
              <SelectField label="Withdrawal Processing Time" value={paymentConfig.processingTime} options={['Instant', '1–3 business days', '3-5 business days']} onChange={(e) => handleConfigChange('processingTime', e.target.value)} />
                  </div>
          <div className="flex flex-col w-full">
            <SharedToggleRow title="Require Bank Account Verification to Withdraw" description="Sellers must have a verified bank account before requesting payouts" isActive={toggles.bankVerified} onToggle={() => handleToggle('bankVerified')} />
            <SharedToggleRow title="Hold New Seller Payouts for 7 Days" description="Security hold on payouts from newly registered sellers to prevent fraud" isActive={toggles.holdNewSeller} onToggle={() => handleToggle('holdNewSeller')} />
            <SharedToggleRow title="Allow Bulk Withdrawal Requests" description="Sellers can bundle multiple earnings into a single payout request" isActive={toggles.bulkWithdraw} onToggle={() => handleToggle('bulkWithdraw')} isLast />
          </div>
        </SectionCard>
  
        <SectionCard icon={renderIcon(CreditCard, 'purple')} title="Supported Payment Methods" subtitle="Enable or disable available payment channels for users">
          <div className="flex flex-col w-full mt-4">
            <PaymentMethodRow icon={<CreditCard className="w-4 h-4" />} title="Card Payments (Paystack)" provider="Provider: Paystack" isSecure isActive={toggles.cardPayments} onToggle={() => handleToggle('cardPayments')} />
            <PaymentMethodRow icon={<Landmark className="w-4 h-4" />} title="Bank Transfer" provider="Provider: Paystack" isSecure isActive={toggles.bankTransfer} onToggle={() => handleToggle('bankTransfer')} />
            <PaymentMethodRow icon={<Hash className="w-4 h-4" />} title="USSD" provider="Provider: Paystack" isActive={toggles.ussd} onToggle={() => handleToggle('ussd')} />
            <PaymentMethodRow icon={<Smartphone className="w-4 h-4" />} title="Mobile Money (Flutterwave)" provider="Provider: Flutterwave" isActive={toggles.mobileMoney} onToggle={() => handleToggle('mobileMoney')} />
            <PaymentMethodRow icon={<Bitcoin className="w-4 h-4" />} title="Cryptocurrency" provider="Provider: Not integrated" isActive={toggles.crypto} onToggle={() => handleToggle('crypto')} isLast />
          </div>
        </SectionCard>
  
        <div className="flex flex-row items-center justify-between px-5 py-3.5 w-full bg-[#121415] border border-white/5 rounded-xl mt-2">
          <span className="text-xs text-white/45 w-84 leading-relaxed">Payment changes require confirmation before applying globally.</span>
          <div className="flex items-center gap-2.5">
            <Button variant="ghost" size="sm">Discard</Button>
            <Button variant="primary" size="sm" icon={ArrowRight} iconPosition="right" onClick={handleReview}>Review & Confirm</Button>
          </div>
        </div>
      </div>
    );
  }

function SelectField({ label, value, options, onChange }: { label: string; value: string, options: string[]; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-[11px] font-semibold text-white/45 font-['Inter']">{label}</label>
      <div className="relative w-full">
        <select value={value} onChange={onChange} className="w-full px-3.5 py-2.5 bg-white/3 border border-white/10 rounded-lg text-[13px] font-['Raleway'] text-white appearance-none focus:outline-none focus:border-primary-green/50">
          {options.map((opt, i) => <option key={i} value={opt} className="bg-[#10141C]">{opt}</option>)}
        </select>
        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/45 pointer-events-none" />
      </div>
    </div>
  );
}

function PaymentMethodRow({
  icon,
  title,
  provider,
  isSecure = false,
  isActive,
  onToggle,
  isLast
}: {
  icon: React.ReactNode;
  title: string;
  provider: string;
  isSecure?: boolean;
  isActive: boolean;
  onToggle: () => void;
  isLast?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between py-3.5 w-full ${!isLast ? 'border-b border-white/10' : ''}`}>
      <div className="flex items-center gap-3.5">
        <div className={`flex justify-center items-center w-9 h-9 rounded-xl border ${
          isActive 
            ? 'bg-[#A78BFA]/10 border-[#A78BFA]/20 text-[#A78BFA]' 
            : 'bg-white/3 border-white/10 text-white/45'
        }`}>
          {icon}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`font-['Raleway'] font-bold text-[13px] ${isActive ? 'text-white' : 'text-white/45'}`}>
              {title}
            </span>
            {isSecure && (
              <span className="px-1.5 py-0.5 bg-primary-green/10 rounded-md font-['Inter'] font-bold text-[9px] text-primary-green">
                SECURE
              </span>
            )}
          </div>
          <span className="text-[11px] text-white/45 mt-0.5 font-['Inter']">{provider}</span>
        </div>
      </div>
      <Toggle active={isActive} onChange={onToggle} />
    </div>
  );
}