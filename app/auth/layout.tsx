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

  // const clipPath = isSignup
  //   ? "polygon(0% 0%, 88% 0%, 100% 20%, 96% 50%, 100% 85%, 82% 100%, 0% 100%)"
  //   : "polygon(12% 0%, 100% 0%, 100% 100%, 18% 100%, 0% 85%, 5% 50%, 0% 15%)";

  const imagePanel = (
    <div className="hidden lg:flex lg:w-[55%] relative p-5">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full h-full rounded-[48px] overflow-hidden border-4 border-primary-green bg-black flex items-center justify-center p-8 shadow-2xl"
      // style={{
      //   clipPath,
      // }}
      >
        {/* Top Navigation in Image Section */}
        <div className="absolute top-10 left-10 right-10 flex justify-between items-center z-20">
          {isSignup ? (
            <>
              <div className="flex items-center">
                <Image
                  src="/collabden-logo.png"
                  alt="Collabden"
                  width={140}
                  height={35}
                  className="opacity-10"
                  style={{
                    filter: "invert(74%) sepia(13%) saturate(1478%) hue-rotate(50deg) brightness(97%) contrast(85%)"
                  }}
                />
              </div>

              {/* Back Button with Hero Icon */}
              <Link
                href={ROUTES.HOME}
                className="group px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-semibold flex items-center gap-3 hover:bg-white/20 transition-all border border-white/10"
              >
                <span>Back to website</span>
                <BsArrowUpRightCircleFill
                  className="text-primary-green text-xl transition-transform group-hover:rotate-45"
                />
              </Link>
            </>
          ) : (
            <>
              {/* Back Button with Hero Icon */}
              <Link
                href={ROUTES.HOME}
                className="group px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-semibold flex items-center gap-3 hover:bg-white/20 transition-all border border-white/10"
              >
                <span>Back to website</span>
                <BsArrowUpRightCircleFill
                  className="text-primary-green text-xl transition-transform group-hover:rotate-45"
                />
              </Link>

              {/* Brand Logo - Colorized to Primary Green */}
              <div className="flex items-center">
                <Image
                  src="/collabden-logo.png"
                  alt="Collabden"
                  width={140}
                  height={35}
                  className="opacity-95"
                  style={{
                    filter: "invert(74%) sepia(13%) saturate(1478%) hue-rotate(50deg) brightness(97%) contrast(85%)"
                  }}
                />
              </div>
            </>
          )}
        </div>

        {/* Ambient Dark Blue Glows (Spaced apart to frame the headphones) */}
        <div
          className="absolute -top-20 -left-20 w-[500px] h-[500px] pointer-events-none opacity-40 blur-[120px]"
          style={{
            background: "radial-gradient(circle, rgba(32, 79, 153, 0.4) 0%, transparent 70%)"
          }}
        />
        <div
          className="absolute -bottom-20 -right-20 w-[500px] h-[500px] pointer-events-none opacity-40 blur-[120px]"
          style={{
            background: "radial-gradient(circle, rgba(32, 79, 153, 0.4) 0%, transparent 70%)"
          }}
        />

        {/* Dynamic Green Accent Glows */}
        <div
          className="absolute top-1/3 right-1/4 w-96 h-96 pointer-events-none opacity-40 blur-[100px] rounded-full"
          style={{
            background: "radial-gradient(circle, var(--primary-green) 0%, transparent 70%)"
          }}
        />
        <div
          className="absolute bottom-1/4 left-1/4 w-80 h-80 pointer-events-none opacity-30 blur-[80px] rounded-full"
          style={{
            background: "radial-gradient(circle, var(--primary-green) 0%, transparent 70%)"
          }}
        />

        {/* Main Visual Asset */}
        <div className="relative w-full h-full flex items-center justify-center z-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative w-[95%] h-[95%]"
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
      </motion.div>
    </div>
  );

  const formPanel = (
    <div className="w-full lg:w-[45%] flex flex-col justify-center items-center px-6 sm:px-12 lg:px-20 py-12">
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
