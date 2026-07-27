"use client";
import { useState } from "react";
import { 
  FiAlertTriangle, 
  FiCreditCard, 
  FiBriefcase, 
  FiSmartphone, 
  FiShield, 
  FiLock, 
  FiCheckCircle, 
  FiClock
} from "react-icons/fi";
import { IoWalletOutline } from "react-icons/io5";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import InfoTooltip from "@/components/ui/InfoTooltip";

interface FundWalletSetupProps {
  onContinue?: () => void;
  currentBalance?: number;
  requiredTotal?: number;
  recommendedAdd?: number;
  currencySymbol?: string;
}

const BANK_OPTIONS = [
  { label: "Guaranty Trust Bank", value: "gtb" },
  { label: "Zenith Bank", value: "zenith" },
  { label: "First Bank", value: "first" },
  { label: "Access Bank", value: "access" },
  { label: "UBA", value: "uba" }
];

export default function FundWalletSetup({
  onContinue,
  currentBalance = 850000,
  requiredTotal = 5075000,
  recommendedAdd = 5075000,
  currencySymbol = "₦"
}: FundWalletSetupProps) {
  
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank" | "ussd">("card");
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedUssdBank, setSelectedUssdBank] = useState("");
  
  const formatCurrency = (amount: number) => `${currencySymbol}${amount.toLocaleString()}`;
  const deficit = requiredTotal > currentBalance ? requiredTotal - currentBalance : 0;
  const newBalance = currentBalance + recommendedAdd;

  // Summary Box for mobile/desktop placement
  const PaymentSummaryBox = () => (
    <div className="bg-black/15 border border-white/5 rounded-[30px] p-6 flex flex-col backdrop-blur-md w-full">
      <span className="font-raleway font-bold text-[10px] text-text-muted uppercase tracking-[1px] mb-4.5">Payment Summary</span>
      
      <div className="flex flex-col">
        <div className="flex justify-between items-center py-3.5 border-b border-white/5">
          <span className="font-raleway font-normal text-[13px] text-text-muted">Current Balance</span>
          <span className="font-raleway font-bold text-[14px] md:text-[15px] text-white">{formatCurrency(currentBalance)}</span>
        </div>
        <div className="flex justify-between items-center py-3.5 border-b border-white/5">
          <span className="font-raleway font-normal text-[13px] text-white/60">Adding</span>
          <span className="font-raleway font-bold text-[14px] md:text-[15px] text-white">{formatCurrency(recommendedAdd)}</span>
        </div>
        <div className="flex justify-between items-center py-3.5">
          <span className="font-raleway font-normal text-[13px] text-text-muted">New Balance</span>
          <span className="font-raleway font-bold text-[14px] md:text-[15px] text-primary-green">{formatCurrency(newBalance)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-6">
        
        {/* Main Content (Standard Flow) */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start w-full">
          
          {/* LEFT COLUMN: Main Form */}
          <div className="flex-1 flex flex-col gap-6 w-full">
            
            {/* Wallet Status Box */}
            <div className="bg-black/15 border border-white/5 rounded-[30px] p-6 md:p-7 flex flex-col backdrop-blur-md">
              <div className="flex justify-between items-center w-full mb-6">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-[14px] bg-primary-blue/10 border border-primary-blue/20 flex items-center justify-center">
                    <IoWalletOutline className="text-secondary-blue" size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-raleway font-normal text-[10px] text-text-muted uppercase tracking-[1px]">CollabDen Wallet</span>
                    <span className="font-raleway font-black text-[16px] md:text-[18px] text-white">{formatCurrency(currentBalance)}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-raleway font-normal text-[10px] text-text-muted uppercase tracking-[1px]">Required</span>
                  <span className="font-raleway font-black text-[16px] md:text-[18px] text-accent-yellow">{formatCurrency(requiredTotal)}</span>
                </div>
              </div>
              
              {/* Warning Banner */}
              {deficit > 0 && (
                <div className="w-full bg-accent-yellow/10 border border-accent-yellow/20 rounded-full py-[12px] px-[16px] flex items-center gap-[10px]">
                  <FiAlertTriangle className="text-accent-yellow shrink-0" size={16} />
                  <span className="font-raleway font-normal text-[12px] md:text-[13px] text-accent-yellow">
                    You need an additional {formatCurrency(deficit)} to fund this project.
                  </span>
                </div>
              )}
            </div>

            {/* Amount to Add Box */}
            <div className="bg-black/15 border border-white/5 rounded-[30px] p-6 md:p-7 flex flex-col gap-5 backdrop-blur-md">
              <span className="font-raleway font-bold text-[10px] text-text-muted uppercase tracking-[1px]">Amount to Add</span>
              
              <div className="flex flex-col gap-[8px]">
                <div className="flex items-center gap-[6px]">
                  <span className="font-raleway font-bold text-[11px] text-text-muted uppercase tracking-[0.5px]">Funding Amount</span>
                  <InfoTooltip text="Funding amount includes the base project budget plus a 1.5% escrow processing fee." />
                </div>
                
                <Input 
                  variant="glass" 
                  defaultValue={recommendedAdd.toLocaleString()}
                  className="pl-9 font-bold text-[16px]"
                >
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 font-raleway font-semibold text-[16px] text-text-muted">
                     {currencySymbol}
                   </span>
                </Input>
                <span className="font-raleway font-normal text-[12px] md:text-[13px] text-text-muted/80">
                  Recommended: {formatCurrency(recommendedAdd)} (escrow + 1.5% fee)
                </span>
              </div>
            </div>

            {/* Payment Method Box */}
            <div className="bg-black/15 border border-white/5 rounded-4xl p-6 md:p-7 flex flex-col gap-4.5 backdrop-blur-md relative z-50">
              <span className="font-raleway font-bold text-[10px] text-text-muted uppercase tracking-[1px]">Payment Method</span>
              
              {/* Method Toggles */}
              <div className="flex flex-col gap-3">
                
                {/* Debit Card Option */}
                <div 
                  onClick={() => setPaymentMethod("card")}
                  className={`w-full flex items-center justify-between p-3.5 md:p-4.5 rounded-2xl cursor-pointer transition-all border ${
                    paymentMethod === "card" ? "bg-primary-blue/10 border-primary-blue/35 shadow-[0_0_0_1px_rgba(32,79,153,0.2)]" : "bg-black/15 border-white/10 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3.5 md:gap-4.5">
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-[14px] bg-white/5 flex items-center justify-center">
                      <FiCreditCard className={paymentMethod === "card" ? "text-secondary-blue" : "text-text-muted"} size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className={`font-raleway font-bold text-[14px] md:text-[15px] ${paymentMethod === "card" ? "text-white" : "text-white/60"}`}>Debit Card</span>
                      <span className="font-raleway font-semibold text-[12px] md:text-[13px] text-text-muted/80">Visa / Mastercard / Verve</span>
                    </div>
                  </div>
                  <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center ${paymentMethod === "card" ? "border-primary-blue bg-primary-blue" : "border-white/15"}`}>
                    {paymentMethod === "card" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>

                {/* Card Form */}
                {paymentMethod === "card" && (
                  <div className="flex flex-col gap-4 px-2.5 md:px-4.5 pt-2 pb-3 animate-fade-in">
                    <Input label="CARD NUMBER" placeholder="0000 0000 0000 0000" variant="glass" />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="EXPIRY DATE" placeholder="MM / YY" variant="glass" />
                      <Input label="CVV" type="password" placeholder="***" variant="glass" />
                    </div>
                    <Input label="CARDHOLDER NAME" placeholder="As on card" variant="glass" />
                  </div>
                )}

                {/* Bank Transfer Option */}
                <div 
                  onClick={() => setPaymentMethod("bank")}
                  className={`w-full flex items-center justify-between p-3.5 md:p-4.5 rounded-[18px] cursor-pointer transition-all border ${
                    paymentMethod === "bank" ? "bg-primary-blue/10 border-primary-blue/35 shadow-[0_0_0_1px_rgba(32,79,153,0.2)]" : "bg-black/15 border-white/10 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3.5 md:gap-4.5">
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-white/5 flex items-center justify-center">
                      <FiBriefcase className={paymentMethod === "bank" ? "text-secondary-blue" : "text-text-muted"} size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className={`font-raleway font-bold text-[14px] md:text-[15px] ${paymentMethod === "bank" ? "text-white" : "text-text-muted"}`}>Bank Transfer</span>
                      <span className="font-raleway font-semibold text-[12px] md:text-[13px] text-text-muted/80">Transfer from any Nigerian bank</span>
                    </div>
                  </div>
                  <div className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center ${paymentMethod === "bank" ? "border-primary-blue bg-primary-blue" : "border-white/15"}`}>
                    {paymentMethod === "bank" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>

                {/* Bank Form (Expands) */}
                {paymentMethod === "bank" && (
                  <div className="flex flex-col gap-4 px-2.5 md:px-4.5 pt-2 pb-3 animate-fade-in relative z-50">
                    <Select 
                      label="Select Your Bank" 
                      options={BANK_OPTIONS} 
                      value={selectedBank} 
                      onChange={setSelectedBank} 
                      variant="glass" 
                    />
                    {selectedBank && (
                      <div className="bg-white/5 border border-white/10 rounded-4 p-4 flex flex-col gap-1 animate-fade-in">
                         <span className="font-raleway text-text-muted text-[12px]">Please transfer {formatCurrency(recommendedAdd)} to:</span>
                         <span className="font-raleway text-white font-bold text-[24px] tracking-widest">0123456789</span>
                         <span className="font-raleway text-white/80 text-[14px]">CollabDen Escrow ({BANK_OPTIONS.find(b => b.value === selectedBank)?.label})</span>
                      </div>
                    )}
                  </div>
                )}

                {/* USSD Option */}
                <div 
                  onClick={() => setPaymentMethod("ussd")}
                  className={`w-full flex items-center justify-between p-3.5 md:p-4.5 rounded-[18px] cursor-pointer transition-all border ${
                    paymentMethod === "ussd" ? "bg-primary-blue/10 border-primary-blue/35 shadow-[0_0_0_1px_rgba(32,79,153,0.2)]" : "bg-black/15 border-white/10 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3.5 md:gap-4.5">
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-white/5 flex items-center justify-center">
                      <FiSmartphone className={paymentMethod === "ussd" ? "text-secondary-blue" : "text-text-muted"} size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className={`font-raleway font-bold text-[14px] md:text-[15px] ${paymentMethod === "ussd" ? "text-white" : "text-white/60"}`}>USSD</span>
                      <span className="font-raleway font-semibold text-[12px] md:text-[13px] text-text-muted">Pay with your phone</span>
                    </div>
                  </div>
                  <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center ${paymentMethod === "ussd" ? "border-primary-blue bg-primary-blue" : "border-white/15"}`}>
                    {paymentMethod === "ussd" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>

                {/* USSD Form */}
                {paymentMethod === "ussd" && (
                  <div className="flex flex-col gap-4 px-2.5 md:px-4.5 pt-2 pb-3 z-50 relative animate-fade-in">
                    <Select 
                      label="Select Your Bank to Generate Code" 
                      options={BANK_OPTIONS} 
                      value={selectedUssdBank} 
                      onChange={setSelectedUssdBank} 
                      variant="glass" 
                    />
                    {selectedUssdBank && (
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 animate-fade-in text-center">
                         <span className="font-raleway text-white/50 text-[12px]">Dial this code to complete payment:</span>
                         <span className="font-raleway text-primary-green font-black text-[22px] tracking-widest">*737*1*5075000#</span>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>

            {/* Mobile only: Summary Box */}
            <div className="flex lg:hidden w-full mt-2 mb-2">
              <PaymentSummaryBox />
            </div>

            {/* Submit Button */}
            <Button 
              variant="primary" 
              onClick={onContinue}
              className="w-full rounded-[18px] py-4 md:py-4.5 flex items-center justify-center gap-3 shadow-btn-primary"
            >
              <FiCheckCircle size={18} className="text-white" />
              <span className="font-raleway font-black text-[15px] text-white">Continue to Payment {formatCurrency(recommendedAdd)}</span>
            </Button>

          </div>

          {/* RIGHT COLUMN: Summary Sidebar */}
          <div className="w-full lg:w-77.5 flex flex-col gap-4.5 lg:sticky lg:top-10 shrink-0">
            
            {/* DESKTOP ONLY: Summary Box */}
            <div className="hidden lg:flex w-full">
              <PaymentSummaryBox />
            </div>

            {/* Trust & Security */}
            <div className="bg-black/15 border border-white/5 rounded-[30px] p-6 flex flex-col gap-3.5 backdrop-blur-md">
              <span className="font-raleway font-bold text-[10px] text-text-muted uppercase tracking-[1px] mb-1">Trust & Security</span>
              
              <div className="flex items-center gap-3">
                <FiShield className="text-primary-green" size={16} />
                <span className="font-raleway font-normal text-[13px] text-text-muted/90">Powered by Flutterwave</span>
              </div>
              <div className="flex items-center gap-3">
                <FiLock className="text-primary-green" size={16} />
                <span className="font-raleway font-normal text-[13px] text-text-muted/90">256-bit encryption</span>
              </div>
              <div className="flex items-center gap-3">
                <FiCheckCircle className="text-primary-green" size={16} />
                <span className="font-raleway font-normal text-[13px] text-text-muted/90">PCI-DSS compliant</span>
              </div>
            </div>

            {/* Est. Processing Time */}
            <div className="bg-black/15 border border-white/5 rounded-[30px] p-6 flex flex-col backdrop-blur-md">
              <span className="font-raleway font-bold text-[10px] text-text-muted uppercase tracking-[1px] mb-3">Est. Processing Time</span>
              
              <div className="flex items-center gap-2.5 mb-2">
                <FiClock className="text-primary-green" size={18} />
                <span className="font-raleway font-bold text-[14px] md:text-[15px] text-white">Instant</span>
              </div>
              <p className="font-raleway font-normal text-[12px] text-text-muted/90 leading-[17px]">
                Card payments reflect immediately. Bank transfers might take a few minutes.
              </p>
            </div>

          </div>

        </div>
    </div>
  );
}