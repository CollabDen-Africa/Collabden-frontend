"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMailOutline, IoCheckmarkCircle, IoPersonOutline, IoCallOutline } from 'react-icons/io5';
import Image from 'next/image';
import Link from 'next/link';
import { BsArrowLeftCircleFill } from "react-icons/bs";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { waitlistSchema, WaitlistInput } from '@/lib/validations/waitlist.schema';
import { useWaitlist } from '@/hooks/waitlist/useWaitlist';
import { getErrorMessage } from '@/lib/error-handler';

// Set target date to 2 months from now (November 4, 2026)
const TARGET_DATE = new Date('2026-11-04T00:00:00');

export default function WaitlistPage() {
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const { useJoinWaitlist } = useWaitlist();
  const joinMutation = useJoinWaitlist();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<WaitlistInput>({
    resolver: zodResolver(waitlistSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      name: "",
      phone: "",
    },
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = TARGET_DATE.getTime() - now.getTime();

      if (difference > 0) {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const m = Math.floor((difference / 1000 / 60) % 60);
        const s = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const onSubmit = async (data: WaitlistInput) => {
    setErrorMessage("");

    try {
      await joinMutation.mutateAsync({
        email: data.email,
        name: data.name,
        phoneNumber: data.phone,
      });
      setSubmitted(true);
      reset();

      // Automatically show form again after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (error: any) {
      setErrorMessage(getErrorMessage(error) || "Something went wrong. Please try again.");
    }
  };

  const status = joinMutation.isPending ? "loading" : joinMutation.isError ? "error" : "idle";

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-between p-4 py-4 md:py-6 relative overflow-hidden bg-white/30">
      {/* Back to Home Link */}
      <div className="absolute top-8 left-8 z-20">
        <Link
          href="/"
          className="text-white hover:text-primary-green transition-colors flex items-center gap-2"
        >
          <span className="text-xl">
            <BsArrowLeftCircleFill />
          </span>
          <span className="text-sm font-medium tracking-wide">
            Back to Home
          </span>
        </Link>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.15,
              delayChildren: 0.2,
            },
          },
        }}
        className="relative w-full max-w-2xl z-10 text-center flex flex-col items-center flex-1 justify-center"
      >
        {/* Logo Section */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: -10 },
            visible: { opacity: 1, y: 0 },
          }}
          className="flex items-center justify-center mb-2"
        >
          <Link href="/">
            <div className="relative">
              <Image
                src="/Green-logo.png"
                alt="CollabDen Logo"
                width={180}
                height={180}
                className="h-10 md:h-12 w-auto object-contain"
                priority
              />
            </div>
          </Link>
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-3 tracking-tight">
            Get Early Access
          </h1>
          <p className="text-white text-base md:text-md max-w-2xl mx-auto mb-4 md:mb-5 leading-relaxed">
            We&apos;re getting close. Sign up to get early access to CollabDen
            and start collaborating with other talented professionals
          </p>
        </motion.div>

        {/* Email Form / Success State */}
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form
              key="form"
              variants={{
                hidden: { opacity: 0, scale: 0.98 },
                visible: { opacity: 1, scale: 1 },
              }}
              onSubmit={handleSubmit(onSubmit)}
              className="w-full max-w-lg relative mb-3"
            >
              <div className="flex flex-col gap-3 w-full">
                {/* Grid for Name and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  {/* Name Input */}
                  <div className="flex items-center bg-black/30 border border-white/10 rounded-full p-1.5 md:p-2 pl-4 md:pl-6 focus-within:border-primary-green transition-all shadow-xl group">
                    <IoPersonOutline
                      className="text-white group-focus-within:text-white/60 mr-2 md:mr-3 shrink-0"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="Enter your name"
                      className="bg-transparent border-none outline-none text-white w-full py-2 md:py-3 text-sm md:text-base placeholder:text-white/40 disabled:opacity-50"
                      {...register("name")}
                    />
                  </div>

                  {/* Phone Input */}
                  <div className="flex items-center bg-black/30 border border-white/10 rounded-full p-1.5 md:p-2 pl-4 md:pl-6 focus-within:border-primary-green transition-all shadow-xl group">
                    <IoCallOutline
                      className="text-white group-focus-within:text-white/60 mr-2 md:mr-3 shrink-0"
                      size={20}
                    />
                    <input
                      type="tel"
                      placeholder="Enter your phone number"
                      className="bg-transparent border-none outline-none text-white w-full py-2 md:py-3 text-sm md:text-base placeholder:text-white/40 disabled:opacity-50"
                      {...register("phone")}
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="flex items-center bg-black/30 border border-white/10 rounded-full p-1.5 md:p-2 pl-4 md:pl-6 focus-within:border-primary-green transition-all shadow-xl group">
                  <IoMailOutline
                    className="text-white group-focus-within:text-white/60 mr-2 md:mr-3 shrink-0"
                    size={20}
                  />
                  <input
                    type="email"
                    disabled={status === "loading"}
                    placeholder="Enter your e-mail"
                    className="bg-transparent border-none outline-none text-white w-full py-2 md:py-3 text-sm md:text-base placeholder:text-white/40 disabled:opacity-50"
                    {...register("email")}
                  />
                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={!isValid || status === "loading"}
                    className="bg-primary-green text-white font-semibold px-4 md:px-5 py-2 md:py-2.5 rounded-full transition-all shrink-0 ml-2 shadow-lg shadow-primary-green/20 text-sm md:text-base disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {status === "loading" ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Joining...
                      </>
                    ) : (
                      "Join Waitlist"
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Zod/Submit Error Messages */}
              {(errors.email || errorMessage) && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-3 ml-4 text-left font-medium"
                >
                  {errors.email?.message || errorMessage}
                </motion.p>
              )}
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-lg bg-[#1C1F26]/50 backdrop-blur-md border border-primary-green/30 rounded-2xl p-6 mb-10 flex flex-col items-center gap-3 shadow-[0_0_30px_rgba(25,204,118,0.1)]"
            >
              <IoCheckmarkCircle className="text-primary-green" size={48} />
              <div className="text-center">
                <h3 className="text-white font-bold text-2xl mb-1">
                  You&apos;re on the list!
                </h3>
                <p className="text-white/60">
                  Thank you for joining. We&apos;ll notify you as soon as we
                  launch.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Social Proof */}
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
          className="flex items-center gap-3 mb-3"
        >
          <div className="relative z-10 pointer-events-none flex items-center">
            <Image
              src="/afro-avatar.svg"
              alt="User"
              width={20}
              height={20}
              className="w-auto h-8 rounded-full object-cover"
              priority
            />
          </div>
          <span className="text-white text-sm md:text-base">
            Join +50 others on the waitlist
          </span>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="flex items-center justify-center gap-2 w-full max-w-lg mb-0 px-4"
        >
          {[
            { label: "Days", value: timeLeft.days },
            { label: "Hours", value: timeLeft.hours },
            { label: "Minutes", value: timeLeft.minutes },
            { label: "Seconds", value: timeLeft.seconds },
          ].map((item, index, arr) => (
            <React.Fragment key={item.label}>
              <motion.div
                variants={{
                  hidden: { opacity: 0, scale: 0.5 },
                  visible: { opacity: 1, scale: 1 },
                }}
                className="flex flex-col items-center"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-black/30 rounded-lg md:rounded-xl border-2 border-primary-green/60 mb-1 shadow-2xl">
                  <span className="text-base md:text-lg font-bold text-white">
                    {item.value}
                  </span>
                </div>
                <span className="text-white/50 text-[8px] md:text-[9px] uppercase tracking-wider font-bold">
                  {item.label}
                </span>
              </motion.div>
              {index < arr.length - 1 && (
                <div className="flex items-center justify-center -mt-3 mx-0.5">
                  <span className="text-white/30 font-bold text-lg md:text-xl">
                    :
                  </span>
                </div>
              )}
            </React.Fragment>
          ))}
        </motion.div>
      </motion.div>

      {/* Dashboard Preview - Anchored to bottom with fixed height ratio */}
      <div className="relative w-full max-w-6xl px-4 z-0 pointer-events-none -mt-8.75">
        <motion.div
          initial={{ opacity: 0, y: 100, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 8 }}
          transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
          className="relative w-full aspect-26/10 rounded-t-3xl overflow-hidden border-t border-x border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.6)] transform translate-y-[15%] md:translate-y-[10%]"
          style={{
            perspective: "2000px",
            transformOrigin: "bottom",
          }}
        >
          <Image
            src="/Dashboard preview.png"
            alt="CollabDen Dashboard"
            fill
            className="object-cover object-top mr-55"
            priority
          />
          {/* Gradient overlay to fade it into the bottom */}
          <div className="absolute inset-0 bg-linear-to-t from-black via-white to-transparent opacity-50" />
        </motion.div>
      </div>
    </main>
  );
}
