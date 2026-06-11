"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Custom UI Components
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";

// Validation schema for admin credentials
const adminLoginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

type AdminLoginInput = z.infer<typeof adminLoginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<AdminLoginInput>({
    resolver: zodResolver(adminLoginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = () => {
    // Save authentication state in client-side localStorage
    localStorage.setItem("collabden_admin_logged_in", "true");
    router.replace("/admin/dashboard");
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-6 bg-[#0d0f10] relative">
      <div className="absolute top-8 left-8 z-20">
        <Link href="/" className="text-white/60 hover:text-primary-green transition-colors flex items-center gap-2">
          <span className="text-sm font-medium tracking-wide">&larr; Back to Platform</span>
        </Link>
      </div>

      <div className="w-full max-w-md bg-white text-text-main rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-8 border border-gray-100 flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-9 h-9 bg-primary-green rounded-[9px] flex items-center justify-center">
              <span className="text-white font-bold text-xl leading-none">C</span>
            </div>
            <span className="font-bold text-[20px] leading-tight">CollabDen Admin</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Admin Portal Login
          </h1>
          <p className="text-gray-500 font-medium text-sm">
            Enter your credentials to manage waitlist data
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <Input
            type="email"
            label="Email Address"
            variant="light"
            placeholder="admin@collabden.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <PasswordInput
            label="Password"
            variant="light"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />

          <button
            type="submit"
            disabled={!isValid}
            className={`w-full py-3.5 text-white font-bold rounded-full transition-all cursor-pointer disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-2
              ${isValid
                ? "bg-primary-green shadow-btn-primary hover:shadow-btn-hover hover:-translate-y-0.5 hover:brightness-95 active:scale-[0.98]"
                : "bg-primary-green/60 shadow-none"
              }`}
          >
            Log In
          </button>
        </form>

        <div className="text-center text-xs text-gray-400 mt-2 font-medium">
          Authorized administrator access only. All actions are logged.
        </div>
      </div>
    </main>
  );
}
