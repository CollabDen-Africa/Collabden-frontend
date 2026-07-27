"use client";
import { useState } from "react";
import { 
  FiCheck, 
  FiShield, 
  FiInfo,
  FiArrowRight
} from "react-icons/fi";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import DatePicker from "@/components/ui/DatePicker";
import InfoTooltip from "@/components/ui/InfoTooltip";

interface EscrowTermsSetupProps {
  onContinueToMilestones?: () => void;
  // Dynamic props
  projectBudget?: number;
  currencySymbol?: string;
  collaboratorsCount?: number;
  estMilestones?: number;
}

const CURRENCY_OPTIONS = [
  { label: "NGN (₦)", value: "NGN" },
  { label: "USD ($)", value: "USD" }
];

const FUNDING_OPTIONS = [
  { label: "Fund upfront", value: "full" },
  { label: "Fund per milestone", value: "milestone" }
];

const RELEASE_OPTIONS = [
  { label: "7 Days", value: "7" },
  { label: "14 Days", value: "14" },
  { label: "30 Days", value: "30" }
];

const GRACE_OPTIONS = [
  { label: "3 Days (Default)", value: "3" },
  { label: "5 Days", value: "5" },
  { label: "7 Days", value: "7" }
];

export default function EscrowTermsSetup({ 
  onContinueToMilestones,
  projectBudget = 5000000,
  currencySymbol = "₦",
  collaboratorsCount = 4,
  estMilestones = 4
}: EscrowTermsSetupProps) {
  
  // Controlled form states for custom UI components
  const [currency, setCurrency] = useState("NGN");
  const [fundingMethod, setFundingMethod] = useState("full");
  const [releasePeriod, setReleasePeriod] = useState("7");
  const [gracePeriod, setGracePeriod] = useState("3");
  const [deadline, setDeadline] = useState<Date | null>(null);

  const formatCurrency = (amount: number) => `${currencySymbol}${amount.toLocaleString()}`;

  return (
    <div>
        {/* Section Header */}
        <div className="flex flex-col gap-2 mb-8">
          <h2 className="font-raleway font-extrabold text-[24px] text-white tracking-[-0.6px]">
            Create Escrow Terms
          </h2>
          <p className="font-raleway font-normal text-[14px] text-text-muted">
            Set expectations for how funds will be released. Collaborators will review and approve these terms before escrow is activated.
          </p>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8.5 w-full">
          
          {/* Left Column: Form Configuration */}
          <div className="flex-1 bg-black/15 border border-white/5 rounded-[30px] p-6 flex flex-col backdrop-blur-md">
            <div className="flex flex-col gap-0.5 mb-6">
              <h3 className="font-raleway font-bold text-[16px] text-white">Escrow Configuration</h3>
              <p className="font-raleway font-normal text-[12px] text-text-muted">Set the financial parameters for this project's escrow account.</p>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-4 gap-y-6 mb-6">
              
              {/* Total Project Budget */}
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 font-raleway font-semibold text-[14px] text-white/70">
                  Total Project Budget 
                  <InfoTooltip text="Total amount to be locked in the escrow for all phases." />
                </label>
                <Input 
                  defaultValue={projectBudget.toLocaleString()}
                  variant="glass"
                  className="font-normal"
                />
              </div>

              {/* Currency */}
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 font-raleway font-semibold text-[14px] text-white/70">
                  Currency
                </label>
                <Select 
                  value={currency}
                  onChange={setCurrency}
                  options={CURRENCY_OPTIONS}
                  variant="glass"
                />
              </div>

              {/* Escrow Funding Method */}
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 font-raleway font-semibold text-[14px] text-white/70">
                  Escrow Funding Method 
                  <InfoTooltip text="Choose whether to fund the entire project at once, or milestone-by-milestone." />
                </label>
                <Select 
                  value={fundingMethod}
                  onChange={setFundingMethod}
                  options={FUNDING_OPTIONS}
                  variant="glass"
                />
              </div>

              {/* Funding Deadline */}
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 font-raleway font-semibold text-[14px] text-white/70">
                  Funding Deadline
                </label>
                <DatePicker 
                  selectedDate={deadline}
                  onSelect={setDeadline}
                  className="bg-white/10 border-2 border-transparent hover:border-primary-green rounded-full px-2 whitespace-nowrap text-white"
                />
              </div>

              {/* Automatic Release Period */}
              <div className="flex flex-col gap-[6px]">
                <label className="flex items-center gap-1.5 font-raleway font-semibold text-[14px] text-white/70">
                  Automatic Release Period 
                  <InfoTooltip text="Number of days before funds automatically release if no dispute is raised after completion." />
                </label>
                <Select 
                  value={releasePeriod}
                  onChange={setReleasePeriod}
                  options={RELEASE_OPTIONS}
                  variant="glass"
                />
              </div>

              {/* Approval Grace Period */}
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 font-raleway font-semibold text-[14px] text-white/70">
                  Approval Grace Period 
                  <InfoTooltip text="Time granted to collaborators to review and approve submitted deliverables." />
                </label>
                <Select 
                  value={gracePeriod}
                  onChange={setGracePeriod}
                  options={GRACE_OPTIONS}
                  variant="glass"
                />
              </div>

            </div>

            {/* Optional Notes */}
            <div className="flex flex-col gap-1.5">
              <label className="font-raleway font-semibold text-[14px] text-white/70">Optional Notes</label>
              <textarea 
                placeholder="Any additional payment terms, conditions, or notes"
                className="w-full px-4 py-3 bg-white/10 text-white border-2 border-transparent placeholder:text-white/50 hover:border-primary-green focus:border-primary-green focus:bg-white/15 rounded-[20px] outline-none font-medium transition-all duration-300 min-h-20.5 resize-none custom-scrollbar"
              />
            </div>
          </div>

          {/* Right Column: Escrow Summary Sidebar */}
          <div className="w-full xl:w-88.75 flex flex-col gap-4 shrink-0 xl:sticky xl:top-10">
            
            {/* Escrow Summary Card */}
            <div className="bg-black/15 border border-white/5 rounded-[30px] p-5 flex flex-col backdrop-blur-md">
              <h3 className="font-raleway font-bold text-[14px] text-white mb-3">Escrow Summary</h3>
              
              <div className="flex flex-col">
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="font-raleway font-normal text-[12px] text-text-muted">Project Budget</span>
                  <span className="font-raleway font-bold text-[14px] text-primary-green">{formatCurrency(projectBudget)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="font-raleway font-normal text-[12px] text-text-muted">Collaborators</span>
                  <span className="font-raleway font-bold text-[14px] text-white">{collaboratorsCount} members</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-raleway font-normal text-[12px] text-text-muted">Est. Milestones</span>
                  <span className="font-raleway font-bold text-[14px] text-white">{estMilestones} stages</span>
                </div>
              </div>
            </div>

            {/* Escrow Protection Card */}
            <div className="bg-black/15 border border-white/5 rounded-[30px] p-5 flex flex-col backdrop-blur-md">
              <div className="flex items-center gap-2 mb-4">
                <FiShield size={16} className="text-primary-green" />
                <h3 className="font-raleway font-bold text-[14px] text-white">Escrow Protection</h3>
              </div>
              
              <ul className="flex flex-col gap-3">
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-primary-green/15 flex items-center justify-center shrink-0 mt-0.5">
                    <FiCheck size={10} className="text-primary-green" />
                  </div>
                  <span className="font-raleway font-normal text-[12px] leading-5 text-white/70">
                    Funds held securely until milestones are met
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-primary-green/15 flex items-center justify-center shrink-0 mt-0.5">
                    <FiCheck size={10} className="text-primary-green" />
                  </div>
                  <span className="font-raleway font-normal text-[12px] leading-5 text-white/70">
                    All releases require collaborator consensus
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-primary-green/15 flex items-center justify-center shrink-0 mt-0.5">
                    <FiCheck size={10} className="text-primary-green" />
                  </div>
                  <span className="font-raleway font-normal text-[12px] leading-5 text-white/70">
                    Automated dispute resolution process
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-primary-green/15 flex items-center justify-center shrink-0 mt-0.5">
                    <FiCheck size={10} className="text-primary-green" />
                  </div>
                  <span className="font-raleway font-normal text-[12px] leading-5 text-white/70">
                    Full audit trail & transaction history
                  </span>
                </li>
              </ul>
            </div>

            {/* Notification Banner */}
            <div className="bg-primary-blue/10 border border-primary-blue/15 rounded-[30px] py-3 px-4 flex items-center gap-2">
              <FiInfo size={16} className="text-secondary-blue shrink-0" />
              <span className="font-raleway font-normal text-[12px] leading-5 text-white/80">
                All terms can be revised before collaborator approval
              </span>
            </div>

            {/* Action Button */}
            <Button 
              variant="primary"
              onClick={onContinueToMilestones}
              className="w-full rounded-full py-3.5 mt-2 flex justify-center items-center gap-2"
              icon={FiArrowRight}
              iconPosition="right"
            >
              <span className="font-raleway font-bold text-[14px] text-white">Continue to Milestones</span>
            </Button>

          </div>

        </div>

      </div>
  );
}