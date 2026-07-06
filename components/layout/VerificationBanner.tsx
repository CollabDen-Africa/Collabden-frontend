"use client";

export default function VerificationBanner() {
  return (
    <div className="w-full bg-primary-green rounded-[30px] p-[24px_16px] flex flex-col justify-end gap-4 shadow-lg">
      <p className="font-raleway font-normal text-[14px] text-white leading-5.75">
        Verify your identity to unlock secure payments, legal agreements, and other protected features
      </p>
      <button className="bg-white rounded-full py-2 flex items-center justify-center gap-1.5 w-33 hover:bg-white/90 transition-colors">
        <span className="font-raleway font-semibold text-[11px] 3.75 text-primary-green tracking-wide text-nowrap">
          Verify Your Identity
        </span>
        <div className="w-2 h-2 bg-primary-green rounded-full" />
      </button>
    </div>
  );
}