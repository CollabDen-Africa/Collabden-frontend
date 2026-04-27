"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from 'next/image';
import Button from '@/app/components/ui/Button';
import OnboardingTooltip from "../ui/Tooltip"; 
import { 
  HiPlus,
  HiX,
  HiViewGrid
} from "react-icons/hi";
import { 
  FaCreditCard,
  FaFolderOpen,
  FaStore,
  FaHandshake
} from "react-icons/fa";
import { IoIosChatbubbles } from "react-icons/io";

export default function DashboardSidebar({ 
  onClose,
  currentStep, 
  setStep,
  onSkip 
}: { 
  onClose?: () => void;
  currentStep?: number;
  setStep?: (s: number) => void;
  onSkip?: () => void;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", icon: HiViewGrid, path: "/dashboard" },
    { name: "Projects", icon: FaFolderOpen, path: "/dashboard/projects" },
    { name: "Marketplace", icon: FaStore, path: "/dashboard/marketplace" },
    { name: "Messages", icon: IoIosChatbubbles, path: "/dashboard/messages" },
    { name: "Agreements", icon: FaHandshake, path: "/dashboard/agreements" },
    { name: "Payment", icon: FaCreditCard, path: "/dashboard/payment" },
  ];
  
  const router = useRouter();

  return (
    <aside className="w-full h-full relative overflow-visible flex flex-col">
      <div className="absolute inset-0 bg-black/20 rounded-[30px] border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-md overflow-hidden z-0" />

      {/* CONTENT LAYER */}
      <div className="relative z-10 flex flex-col justify-between h-full w-full">
        
        <div className="flex flex-col w-full">
          {/* Logo Area */}
          <div className="relative pl-[27px] pr-[20px] pt-[33px] pb-[25px] flex items-center justify-between">
            <div className="flex items-center gap-[6px]">
              <div className="w-9 h-9 bg-primary-green rounded-[9px] flex items-center justify-center shrink-0">
                 <Image
                   src="/collabden-logo-small.png"
                   alt="logo"
                   width={25}
                   height={25}
                 />
              </div>

              <div className="flex flex-col justify-center mt-[-2px]">
                <span className="text-foreground font-bold text-[20px] leading-tight">CollabDen</span>
                <span className="text-foreground/80 font-medium text-[13px] leading-tight">Studio Pro</span>
              </div>
            </div>

            {/* STEP 2 TOOLTIP */}
            {currentStep === 2 && (
                <OnboardingTooltip 
                  step={2}
                  title="Navigate your workspace"
                  description="Access your projects, messages, marketplace, and more from here"
                  onNext={() => setStep?.(3)}
                  onSkip={() => onSkip?.()}
                  direction="right-of"
                  arrowOffset="30px"
                />
            )}
            
            {onClose && (
              <button onClick={onClose} className="lg:hidden p-1 text-foreground/60 hover:text-foreground transition-colors">
                <HiX size={24} />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col w-full gap-[16px] py-[10px]">
            {navItems.map((item) => {
              const isActive = pathname === item.path || (pathname === '/' && item.name === 'Dashboard');
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={onClose}
                  className={`relative flex items-center gap-[10px] pl-[25px] pr-[20px] h-[52px] w-full transition-colors group ${
                    isActive 
                      ? "bg-gradient-to-r from-primary-green/20 via-transparent to-transparent to-75% text-primary-green" 
                      : "text-foreground hover:bg-white/5"
                  }`}
                >
                  {isActive && (
                    <div className="absolute -left-[0.1px] top-1/2 -translate-y-1/2 w-[13px] h-[50px] bg-primary-green rounded-r-[50px]" />
                  )}
                  <item.icon size={20} className={`${isActive ? "text-primary-green" : "text-foreground group-hover:text-foreground/80"} shrink-0 transition-colors`} />
                  <span className={`text-[16px] ${isActive ? "font-bold text-primary-green" : "font-medium text-foreground"} transition-colors`}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* New Project Button Area */}
        <div className="px-[18px] pb-[20px] w-full">
                  <div className="relative w-full">
                    <Button 
                              variant="primary"
                              icon={HiPlus}
                              iconPosition="left"
                              onClick={() => router.push("/projects/new-project")}
                              className="shrink-0 h-[48px] px-6"
                            >
                              <span className="font-sans font-semibold text-[16px] whitespace-nowrap">New Project</span>
                            </Button>
        
                    {/* STEP 3 TOOLTIP */}
                    {currentStep === 3 && (
                        <OnboardingTooltip 
                          step={3}
                          title="Create your first project"
                          description="Start a new collaboration by creating a project and inviting others"
                          onNext={() => setStep?.(4)}
                          onSkip={() => onSkip?.()}
                          direction="right-of"
                  arrowOffset="20%"
                mobileDirection="top"
                        />
                    )}
                  </div>
        </div>
      </div>
      
    </aside>
  );
}