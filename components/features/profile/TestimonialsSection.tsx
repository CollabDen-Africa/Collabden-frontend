"use client";
import { TESTIMONIALS } from "@/lib/mockData";

export default function TestimonialsSection() {
  return (
    <div className="w-full bg-white/5 border border-white/10 rounded-[35px] p-6 flex flex-col backdrop-blur-md">
      <h2 className="font-bold text-[18px] text-white mb-6 pl-px">Endorsements & Testimonials</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
        {TESTIMONIALS.map((test) => (
          <div key={test.id} className="bg-white/5 border border-white/10 rounded-[14px] p-5 flex flex-col w-full h-46">
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="13" height="13" viewBox="0 0 13 13" fill="#73BF44" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.5 0L8.463 4.292L13 4.908L9.75 8.35L10.519 13L6.5 10.708L2.481 13L3.25 8.35L0 4.908L4.537 4.292L6.5 0Z" />
                </svg>
              ))}
            </div>
            <p className="italic font-normal text-[13px] text-white/75 leading-5.25 flex-1">
              &quot;{test.text}&quot;
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-9 h-9 rounded-full bg-primary-blue/40 border-[1.1px] border-primary-blue/50 flex items-center justify-center shrink-0">
                <span className="font-bold text-[12px] text-white">{test.initials}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-[13px] text-white leading-none"> — {test.name}</span>
                <span className="font-normal text-[11px] text-text-muted mt-1">{test.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}