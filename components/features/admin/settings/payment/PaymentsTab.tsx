import React, { useState } from "react";
import {
  FiCreditCard,
  FiAlertCircle,
  FiChevronDown,
  FiFileText,
  FiDownload,
  FiHome,
  FiHash,
  FiSmartphone,
  FiArrowRight,
} from "react-icons/fi";
import { FaBitcoin } from "react-icons/fa";
import Button from "@/components/ui/Button";
import { SectionCard } from "@/components/ui/SectionCard";
import { SharedToggleRow } from "@/components/ui/SharedToggleRow";
import Toggle from "@/components/ui/Toggle";

export default function PlatformSettingsPayments({
  onTriggerConfirm,
}: {
  onTriggerConfirm: (payload: any) => void;
}) {
  const [paymentConfig, setPaymentConfig] = useState({
    marketplaceFee: "10%",
    escrowFee: "2.5%",
    subShare: "0% (flat-rate plan)",
    disputeFee: "₦500 flat",
    minWithdrawal: "₦5,000",
    maxWithdrawal: "₦2,000,000",
    dailyLimit: "₦5,000,000",
    processingTime: "1–3 business days",
  });

  const [toggles, setToggles] = useState({
    bankVerified: true,
    holdNewSeller: true,
    bulkWithdraw: false,
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
    setPaymentConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleReview = () => {
    onTriggerConfirm({
      changes: [
        { label: "Marketplace Service Fee", oldValue: "8%", newValue: paymentConfig.marketplaceFee },
        { label: "Minimum Withdrawal Amount", oldValue: "₦2,000", newValue: paymentConfig.minWithdrawal },
      ],
    });
  };

  const renderIcon = (IconComp: any, theme: "green" | "blue" | "purple" = "green") => {
    const themes = {
      green: "text-primary-green bg-primary-green/10 border-primary-green/20",
      blue: "text-secondary-blue bg-secondary-blue/10 border-secondary-blue/20",
      purple: "text-secondary-blue bg-secondary-blue/10 border-secondary-blue/20",
    };
    return (
      <div className={`flex justify-center items-center w-9 h-9 border rounded-xl ${themes[theme].split(" ").slice(1).join(" ")}`}>
        <IconComp className={`w-4 h-4 ${themes[theme].split(" ")[0]}`} />
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <SectionCard
        icon={renderIcon(FiFileText, "green")}
        title="Platform Transaction Fees"
        subtitle="Fees applied to marketplace transactions and escrow services"
      >
        <div className="flex flex-row items-start p-3 gap-2.5 w-full bg-accent-yellow/10 border border-accent-yellow/20 rounded-xl mb-4 mt-2">
          <FiAlertCircle className="w-4 h-4 text-accent-yellow shrink-0 mt-0.5" />
          <p className="text-xs text-accent-yellow leading-relaxed">
            Changing transaction fees affects all new transactions. Existing active escrows retain their original fee structure.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="Marketplace Service Fee"
            value={paymentConfig.marketplaceFee}
            options={["5%", "8%", "10%", "12%"]}
            onChange={(e) => handleConfigChange("marketplaceFee", e.target.value)}
          />
          <SelectField
            label="Escrow Processing Fee"
            value={paymentConfig.escrowFee}
            options={["1.5%", "2.0%", "2.5%", "3.0%"]}
            onChange={(e) => handleConfigChange("escrowFee", e.target.value)}
          />
          <SelectField
            label="Platform Subscription Share"
            value={paymentConfig.subShare}
            options={["0% (flat-rate plan)", "5%"]}
            onChange={(e) => handleConfigChange("subShare", e.target.value)}
          />
          <SelectField
            label="Dispute Resolution Fee"
            value={paymentConfig.disputeFee}
            options={["Free", "₦500 flat", "₦1,000 flat"]}
            onChange={(e) => handleConfigChange("disputeFee", e.target.value)}
          />
        </div>
      </SectionCard>

      <SectionCard
        icon={renderIcon(FiDownload, "blue")}
        title="Withdrawal Limits & Thresholds"
        subtitle="Configure payout eligibility and limits for sellers on the platform"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-2">
          <SelectField
            label="Minimum Withdrawal Amount"
            value={paymentConfig.minWithdrawal}
            options={["₦2,000", "₦5,000", "₦10,000"]}
            onChange={(e) => handleConfigChange("minWithdrawal", e.target.value)}
          />
          <SelectField
            label="Maximum Single Withdrawal"
            value={paymentConfig.maxWithdrawal}
            options={["₦1,000,000", "₦2,000,000", "No Limit"]}
            onChange={(e) => handleConfigChange("maxWithdrawal", e.target.value)}
          />
          <SelectField
            label="Daily Withdrawal Limit"
            value={paymentConfig.dailyLimit}
            options={["₦2,000,000", "₦5,000,000", "No Limit"]}
            onChange={(e) => handleConfigChange("dailyLimit", e.target.value)}
          />
          <SelectField
            label="Withdrawal Processing Time"
            value={paymentConfig.processingTime}
            options={["Instant", "1–3 business days", "3-5 business days"]}
            onChange={(e) => handleConfigChange("processingTime", e.target.value)}
          />
        </div>
        <div className="flex flex-col w-full">
          <SharedToggleRow
            title="Require Bank Account Verification to Withdraw"
            description="Sellers must have a verified bank account before requesting payouts"
            isActive={toggles.bankVerified}
            onToggle={() => handleToggle("bankVerified")}
          />
          <SharedToggleRow
            title="Hold New Seller Payouts for 7 Days"
            description="Security hold on payouts from newly registered sellers to prevent fraud"
            isActive={toggles.holdNewSeller}
            onToggle={() => handleToggle("holdNewSeller")}
          />
          <SharedToggleRow
            title="Allow Bulk Withdrawal Requests"
            description="Sellers can bundle multiple earnings into a single payout request"
            isActive={toggles.bulkWithdraw}
            onToggle={() => handleToggle("bulkWithdraw")}
            isLast
          />
        </div>
      </SectionCard>

      <SectionCard
        icon={renderIcon(FiCreditCard, "purple")}
        title="Supported Payment Methods"
        subtitle="Enable or disable available payment channels for users"
      >
        <div className="flex flex-col w-full mt-2">
          <PaymentMethodRow
            icon={<FiCreditCard className="w-4 h-4 text-primary-green" />}
            title="Card Payments (Paystack)"
            provider="Provider: Paystack"
            isSecure
            isActive={toggles.cardPayments}
            onToggle={() => handleToggle("cardPayments")}
          />
          <PaymentMethodRow
            icon={<FiHome className="w-4 h-4 text-primary-green" />}
            title="Bank Transfer"
            provider="Provider: Paystack"
            isSecure
            isActive={toggles.bankTransfer}
            onToggle={() => handleToggle("bankTransfer")}
          />
          <PaymentMethodRow
            icon={<FiHash className="w-4 h-4 text-secondary-blue" />}
            title="USSD"
            provider="Provider: Paystack"
            isActive={toggles.ussd}
            onToggle={() => handleToggle("ussd")}
          />
          <PaymentMethodRow
            icon={<FiSmartphone className="w-4 h-4 text-secondary-blue" />}
            title="Mobile Money (Flutterwave)"
            provider="Provider: Flutterwave"
            isActive={toggles.mobileMoney}
            onToggle={() => handleToggle("mobileMoney")}
          />
          <PaymentMethodRow
            icon={<FaBitcoin className="w-4 h-4 text-accent-yellow" />}
            title="Cryptocurrency"
            provider="Provider: Not integrated"
            isActive={toggles.crypto}
            onToggle={() => handleToggle("crypto")}
            isLast
          />
        </div>
      </SectionCard>

      <div className="flex flex-row items-center justify-between px-5 py-3.5 w-full bg-card-bg/20 border border-white/5 rounded-xl mt-2">
        <span className="text-xs text-white/50 leading-relaxed">
          Payment changes require confirmation before applying globally.
        </span>
        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            icon={FiArrowRight}
            iconPosition="right"
            onClick={handleReview}
          >
            Review & Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-[11px] font-semibold text-white/50">{label}</label>
      <div className="relative w-full">
        <select
          value={value}
          onChange={onChange}
          className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg text-xs font-sans text-white appearance-none focus:outline-none focus:border-primary-green transition-colors"
        >
          {options.map((opt, i) => (
            <option key={i} value={opt} className="bg-card-bg-alt text-white">
              {opt}
            </option>
          ))}
        </select>
        <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
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
  isLast,
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
    <div
      className={`flex items-center justify-between py-3.5 w-full ${
        !isLast ? "border-b border-white/10" : ""
      }`}
    >
      <div className="flex items-center gap-3.5">
        <div
          className={`flex justify-center items-center w-9 h-9 rounded-xl border ${
            isActive
              ? "bg-secondary-blue/10 border-secondary-blue/20 text-secondary-blue"
              : "bg-white/5 border-white/10 text-white/40"
          }`}
        >
          {icon}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span
              className={`font-bold text-xs ${
                isActive ? "text-white" : "text-white/40"
              }`}
            >
              {title}
            </span>
            {isSecure && (
              <span className="px-1.5 py-0.5 bg-primary-green/10 rounded-md font-bold text-[9px] text-primary-green border border-primary-green/20">
                SECURE
              </span>
            )}
          </div>
          <span className="text-[11px] text-white/40 mt-0.5">{provider}</span>
        </div>
      </div>
      <Toggle active={isActive} onChange={onToggle} />
    </div>
  );
}