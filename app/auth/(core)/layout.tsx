"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ROUTES } from "@/constants/routes";
import { BsArrowUpRightCircleFill } from "react-icons/bs";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSignup = pathname === ROUTES.AUTH.SIGNUP;

  const imagePanel = (
    <div className="hidden lg:flex lg:w-[55%] relative p-5">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full h-full"
      >
        {/* SVG Stylized Background & Border */}
        <svg
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full drop-shadow-2xl overflow-visible"
        >
          <defs>
            <clipPath id="panelClipSignup">
              <path d="M 0,48 A 48,48 0 0 1 48,0 H 900 A 48,48 0 0 1 948,48 L 848,952 A 48,48 0 0 1 800,1000 H 48 A 48,48 0 0 1 0,952 Z" />
            </clipPath>
            <clipPath id="panelClipLogin">
              <path d="M 1000,48 A 48,48 0 0 0 952,0 H 100 A 48,48 0 0 0 52,48 L 152,952 A 48,48 0 0 0 200,1000 H 952 A 48,48 0 0 0 1000,952 Z" />
            </clipPath>
          </defs>
          {isSignup ? (
            <path
              d="M 0,48 A 48,48 0 0 1 48,0 H 900 A 48,48 0 0 1 948,48 L 848,952 A 48,48 0 0 1 800,1000 H 48 A 48,48 0 0 1 0,952 Z"
              className="fill-black stroke-primary-green stroke-[4]"
              vectorEffect="non-scaling-stroke"
            />
          ) : (
            <path
              d="M 1000,48 A 48,48 0 0 0 952,0 H 100 A 48,48 0 0 0 52,48 L 152,952 A 48,48 0 0 0 200,1000 H 952 A 48,48 0 0 0 1000,952 Z"
              className="fill-black stroke-primary-green stroke-[4]"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>

        {/* Layer 2: Ambient Glows (Contained within the clip) */}
        <div
          className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-[48px]"
          style={{
            clipPath: `url(#${isSignup ? 'panelClipSignup' : 'panelClipLogin'})`
          }}
        >
          <div
            className={`absolute -top-40 w-[800px] h-[800px] ${isSignup ? "-left-40" : "-right-40"}`}
            style={{
              background: "radial-gradient(circle, rgba(37, 99, 235, 0.6) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* Layer 3: Unclipped Content (Increased horizontal padding to clear the slant) */}
        <div className={`relative z-10 w-full h-full p-8 lg:px-16 flex flex-col ${isSignup ? "items-start" : "items-end text-right"}`}>
          {/* Top Navigation */}
          <div className="w-full flex justify-between items-center z-20 mb-12">
            {isSignup ? (
              <>
                <Image src="/collabden-green.png" alt="Collabden" width={140} height={35} className="opacity-95" />
                <Link href={ROUTES.HOME} className="group px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-semibold flex items-center gap-3 hover:bg-white/30 transition-all">
                  <span>Back to website</span>
                  <BsArrowUpRightCircleFill className="text-primary-green text-xl transition-transform group-hover:rotate-45" />
                </Link>
              </>
            ) : (
              <>
                <Link href={ROUTES.HOME} className="group px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-semibold flex items-center gap-3 hover:bg-white/30 transition-all">
                  <span>Back to website</span>
                  <BsArrowUpRightCircleFill className="text-primary-green text-xl transition-transform group-hover:rotate-45" />
                </Link>
                <Image src="/collabden-green.png" alt="Collabden" width={140} height={35} className="opacity-95" />
              </>
            )}
          </div>

          {/* Main Visual Asset (Reduced footprint to avoid clip) */}
          <div className={`w-[75%] h-full flex items-start ${isSignup ? "justify-start" : "justify-end"}`}>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative w-full h-full max-h-[700px]"
            >
              <Image
                src="/headphone.svg"
                alt="Collabden Headphones"
                fill
                className="object-contain"
                priority
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const formPanel = (
    <div className="w-full lg:w-[45%] flex flex-col justify-center items-center px-6 sm:px-12 lg:px-20 py-12">
      {/* Mobile-only centered green logo */}
      <div className="lg:hidden mb-12">
        <Image
          src="/collabden-green.png"
          alt="Collabden"
          width={180}
          height={45}
          priority
          className="h-auto"
        />
      </div>
      <motion.div
        initial={{ opacity: 0, x: isSignup ? 40 : -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "backOut" }}
        className="w-full max-w-md"
      >
        {children}
      </motion.div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-white overflow-hidden scrollbar-hide">
      {isSignup ? (
        <>
          {imagePanel}
          {formPanel}
        </>
      ) : (
        <>
          {formPanel}
          {imagePanel}
        </>
      )}
    </div>
  );
}
