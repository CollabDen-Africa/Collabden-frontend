"use client";

import React, { useState } from "react";
import { 
  FiMessageCircle, 
  FiAlertOctagon, 
  FiBookOpen, 
  FiArrowRight,
  FiStar,
  FiLoader
} from "react-icons/fi";
import { LuLightbulb } from "react-icons/lu";
import Button from "@/components/ui/Button";
import { useSecurity } from "@/hooks/security/useSecurity";

const SUPPORT_CARDS = [
  { 
    id: 'contact', 
    title: "Contact Support", 
    desc: "Talk to our team via live chat or email", 
    link: "Open Chat", 
    color: "#6495ED", 
    icon: FiMessageCircle 
  },
  { 
    id: 'report', 
    title: "Report a Problem", 
    desc: "Let us know about bugs or unexpected behavior", 
    link: "Report", 
    color: "#FF0000", 
    icon: FiAlertOctagon 
  },
  { 
    id: 'knowledge', 
    title: "Knowledge Base", 
    desc: "Browse guides, tutorials, and documentation", 
    link: "Browse", 
    color: "#73BF44", 
    icon: FiBookOpen 
  },
  { 
    id: 'feedback', 
    title: "Submit Feedback", 
    desc: "Share your experience with the CollabDen team", 
    link: "Send Feedback", 
    color: "#FBBC04", 
    icon: FiStar
  },
  { 
    id: 'features', 
    title: "Feature Requests", 
    desc: "Suggest new features and vote on existing ideas", 
    link: "Request Feature", 
    color: "#9B59B6", 
    icon: LuLightbulb  
  },
];

export default function ProfileSettingsSupport() {
  const { useCreateSupportTicket } = useSecurity();
  const createTicketMutation = useCreateSupportTicket();

  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    try {
      await createTicketMutation.mutateAsync({ subject, message });
      setStatus("Ticket submitted successfully! Our support team will get back to you shortly.");
      setSubject("");
      setMessage("");
      setTimeout(() => {
        setShowForm(false);
        setStatus(null);
      }, 3000);
    } catch {
      setStatus("Failed to submit ticket. Please try again.");
    }
  };

  return (
    <div className="flex flex-col w-full flex-1 gap-8.75 animate-in fade-in duration-300 pb-10">
      
      {/* Header */}
      <div className="flex flex-col gap-1.5 mb-3">
        <h1 className="font-inter font-semibold text-[26.4px] leading-8.5 text-white">
          Support & Help
        </h1>
        <p className="font-inter font-normal text-[20.5px] leading-7.25 text-text-muted">
          We&apos;re here whenever you need us
        </p>
      </div>

      {/* Support Cards Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
        {SUPPORT_CARDS.map((card) => {
          const Icon = card.icon;
          
          return (
            <div 
              key={card.id} 
              className="bg-black/20 border border-white/10 rounded-[35px] p-7.25 flex flex-col justify-between h-full backdrop-blur-md min-h-58.75 group hover:border-white/20 transition-all"
            >
              <div className="flex flex-col gap-[17.6px]">
                {/* Icon Container */}
                <div 
                  className="w-[58.6px] h-[58.6px] rounded-[23.5px] flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${card.color}18` }} 
                >
                  <Icon size={26} color={card.color} />
                </div>
                
                {/* Text Data */}
                <div className="flex flex-col gap-0.75">
                  <span className="font-inter font-medium text-[20.5px] text-white">
                    {card.title}
                  </span>
                  <span className="font-inter font-medium text-[17.6px] text-white/50 leading-5.75">
                    {card.desc}
                  </span>
                </div>
              </div>

              {/* Action Link */}
              <button 
                onClick={() => {
                  if (card.id === 'contact' || card.id === 'report') {
                    setShowForm(true);
                  }
                }}
                className="flex items-center gap-1.5 mt-[17.6px] w-fit group-hover:opacity-80 transition-opacity"
                style={{ color: card.color }}
              >
                <span className="font-inter font-semibold text-[17.6px]">
                  {card.link}
                </span>
                <FiArrowRight size={18} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Ticket Form */}
      {showForm && (
        <form onSubmit={handleSubmitTicket} className="w-full bg-white/15 border border-white/10 rounded-[35px] p-8 flex flex-col gap-4 animate-in slide-in-from-bottom-6 duration-300">
          <h2 className="font-raleway font-semibold text-[22px] text-white">Submit a Support Ticket</h2>
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] text-white/70">Subject</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="How can we help?"
              className="w-full h-[45px] rounded-xl bg-black/20 border border-white/10 px-4 text-white outline-none focus:border-primary-green placeholder:text-white/20"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] text-white/70">Message</label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your issue in detail..."
              className="w-full rounded-xl bg-black/20 border border-white/10 p-4 text-white outline-none focus:border-primary-green placeholder:text-white/20 resize-none"
            />
          </div>

          {status && (
            <span className={`text-[14px] ${status.includes("successfully") ? "text-primary-green" : "text-red-400"}`}>
              {status}
            </span>
          )}

          <div className="flex gap-3 mt-2">
            <Button
              type="submit"
              disabled={createTicketMutation.isPending}
              className="bg-primary-green text-white px-6"
            >
              {createTicketMutation.isPending ? <FiLoader className="animate-spin m-auto" /> : "Submit Ticket"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowForm(false);
                setStatus(null);
              }}
              className="text-white border-white/10"
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* System Status Footer Card */}
      <div className="w-full bg-primary-green/5 border-[1.6px] border-primary-green/15 rounded-[35px] px-7.25 py-5.75 flex flex-row items-center justify-between backdrop-blur-md mt-2.5">
        
        {/* Status Indicator */}
        <div className="flex items-center gap-[17.6px]">
          <div className="w-[11.7px] h-[11.7px] bg-primary-green rounded-full shadow-[0_0_8px_rgba(115,191,68,0.8)] animate-pulse" />
          <span className="font-inter font-normal text-[20.5px] text-white">
            All systems operational
          </span>
        </div>

        {/* Link */}
        <button className="flex items-center gap-1.5 text-primary-green hover:brightness-125 transition-all">
          <span className="font-inter font-medium text-[17.6px]">
            Status Page
          </span>
          <FiArrowRight size={18} />
        </button>
        
      </div>

    </div>
  );
}