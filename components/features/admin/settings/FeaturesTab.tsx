import React, { useState } from "react";
import {
  FiAlertCircle,
  FiInfo,
  FiSliders,
  FiShoppingBag,
  FiCreditCard,
  FiFileText,
  FiShield,
  FiBriefcase,
  FiLayers,
  FiTrendingUp,
  FiSend,
} from "react-icons/fi";
import { SectionCard } from "@/components/ui/SectionCard";
import Toggle from "@/components/ui/Toggle";

export default function FeaturesTab() {
  const [features, setFeatures] = useState({
    marketplace: true,
    payments: true,
    legal: true,
    verification: true,
    workspace: true,
    subscriptions: true,
    disputes: true,
    analytics: false,
  });

  const handleToggle = (key: keyof typeof features) => {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderHeaderIcon = () => (
    <div className="flex justify-center items-center w-9 h-9 bg-accent-yellow/10 border border-accent-yellow/20 rounded-xl shrink-0">
      <FiSliders className="w-4 h-4 text-accent-yellow" />
    </div>
  );

  return (
    <div className="flex flex-col gap-4 w-full">
      <SectionCard
        icon={renderHeaderIcon()}
        title="Feature Availability"
        subtitle="Enable or disable platform features for maintenance"
      >
        <div className="flex flex-row items-start p-3 gap-2.5 w-full bg-accent-yellow/10 border border-accent-yellow/20 rounded-xl mt-2 mb-2">
          <FiAlertCircle className="w-4 h-4 text-accent-yellow shrink-0 mt-0.5" />
          <p className="text-xs text-accent-yellow leading-relaxed">
            Disabling a feature immediately affects all active users across the platform.
          </p>
        </div>

        <div className="flex flex-col w-full mt-2">
          <FeatureToggleRow
            icon={FiShoppingBag}
            title="Marketplace"
            description="User listings, buying, and selling"
            tag="CRITICAL"
            isActive={features.marketplace}
            onToggle={() => handleToggle("marketplace")}
          />
          <FeatureToggleRow
            icon={FiCreditCard}
            title="Payments & Escrow"
            description="Transaction processing and escrow system"
            tag="CRITICAL"
            isActive={features.payments}
            onToggle={() => handleToggle("payments")}
          />
          <FeatureToggleRow
            icon={FiFileText}
            title="Legal Agreements"
            description="Collaboration contracts and digital signing"
            isActive={features.legal}
            onToggle={() => handleToggle("legal")}
          />
          <FeatureToggleRow
            icon={FiShield}
            title="Verification System"
            description="Identity verification workflows for users"
            isActive={features.verification}
            onToggle={() => handleToggle("verification")}
          />
          <FeatureToggleRow
            icon={FiBriefcase}
            title="Project Workspace"
            description="Collaborative project rooms and file sharing"
            isActive={features.workspace}
            onToggle={() => handleToggle("workspace")}
          />
          <FeatureToggleRow
            icon={FiLayers}
            title="Subscription Plans"
            description="Pro/Basic plan access and billing"
            tag="CRITICAL"
            isActive={features.subscriptions}
            onToggle={() => handleToggle("subscriptions")}
          />
          <FeatureToggleRow
            icon={FiTrendingUp}
            title="Dispute Resolution"
            description="User complaint and arbitration system"
            isActive={features.disputes}
            onToggle={() => handleToggle("disputes")}
          />
          <FeatureToggleRow
            icon={FiTrendingUp}
            title="Analytics Dashboard"
            description="Real-time metrics visible to users and admins"
            isActive={features.analytics}
            onToggle={() => handleToggle("analytics")}
            isLast
          />
        </div>

        <div className="flex flex-row items-start p-3 gap-2.5 w-full bg-secondary-blue/10 border border-secondary-blue/20 rounded-xl mt-4">
          <FiInfo className="w-4 h-4 text-secondary-blue shrink-0 mt-0.5" />
          <p className="text-xs text-secondary-blue leading-relaxed">
            When a feature is disabled, all active users receive an in-app notice explaining current maintenance status.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}

function FeatureToggleRow({
  icon: Icon,
  title,
  description,
  tag,
  isActive,
  onToggle,
  isLast,
}: {
  icon: any;
  title: string;
  description: string;
  tag?: "CRITICAL";
  isActive: boolean;
  onToggle: () => void;
  isLast?: boolean;
}) {
  const isDisabledRow = !isActive;
  const displayTag = isDisabledRow ? "DISABLED" : tag;

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between py-3.5 w-full gap-4 transition-colors duration-300 ${
        !isLast ? "border-b border-white/10" : ""
      } ${isDisabledRow ? "bg-accent-red/5 -mx-3 px-3 rounded-xl" : ""}`}
    >
      <div className="flex items-start sm:items-center gap-3.5">
        <div
          className={`flex justify-center items-center w-9 h-9 rounded-xl border shrink-0 transition-colors duration-300 ${
            isDisabledRow
              ? "bg-accent-red/10 border-accent-red/20 text-accent-red"
              : "bg-primary-green/10 border-primary-green/20 text-primary-green"
          }`}
        >
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <span
              className={`font-bold text-xs transition-colors duration-300 ${
                isDisabledRow ? "text-white/40" : "text-white"
              }`}
            >
              {title}
            </span>
            {displayTag && (
              <span
                className={`px-1.5 py-0.5 rounded-md font-bold text-[9px] transition-colors duration-300 ${
                  displayTag === "DISABLED" || displayTag === "CRITICAL"
                    ? "bg-accent-red/10 text-accent-red border border-accent-red/20"
                    : ""
                }`}
              >
                {displayTag}
              </span>
            )}
          </div>
          <span className="text-[11px] text-white/40 font-sans">
            {description}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-auto">
        {isDisabledRow && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-secondary-blue/10 border border-secondary-blue/20 rounded-lg">
            <FiSend className="w-2.5 h-2.5 text-secondary-blue" />
            <span className="font-bold text-[10px] text-secondary-blue">
              Users notified
            </span>
          </div>
        )}
        <Toggle active={isActive} onChange={onToggle} />
      </div>
    </div>
  );
}