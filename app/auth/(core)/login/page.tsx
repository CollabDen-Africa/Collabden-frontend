"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/validations/auth.schema";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/context/AuthContext";
import { useResendVerification } from "@/hooks/auth/useVerifyEmail";
import { FcGoogle } from "react-icons/fc";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";

export default function LoginPage() {
  const { login, isLoading: authLoading, error: authError, clearError } = useAuth();
  const router = useRouter();
  const resendMutation = useResendVerification();
  const [resendMessage, setResendMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const watchedEmail = watch("email");

  const isUnverifiedError = useMemo(() => {
    if (!authError) return false;
    const lowerError = authError.toLowerCase();
    return lowerError.includes("verify") || lowerError.includes("verified");
  }, [authError]);

  const isNotFoundError = useMemo(() => {
    if (!authError) return false;
    const lowerError = authError.toLowerCase();
    return lowerError.includes("not found") || 
           lowerError.includes("exist") || 
           lowerError.includes("no account") ||
           lowerError.includes("not register");
  }, [authError]);

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  const handleResendVerification = async () => {
    if (!watchedEmail) return;
    try {
      setResendMessage("");
      await resendMutation.mutateAsync(watchedEmail);
      setResendMessage("Verification code resent! Redirecting...");
      setTimeout(() => {
        router.push(`${ROUTES.AUTH.VERIFY_EMAIL}?email=${encodeURIComponent(watchedEmail)}`);
      }, 1500);
    } catch {
      // Error handled by mutation
    }
  };

  const onSubmit = async (data: LoginInput) => {
    clearError();
    setResendMessage("");
    try {
      await login({ email: data.email, password: data.password });
    } catch {
      // Error is managed globally by AuthContext
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Welcome Back!
        </h1>
        <p className="text-gray-500 font-medium text-base">
          Continue collaborating with creators who get you
        </p>
      </div>

      {resendMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-1">
          {resendMessage}
        </div>
      )}

      {authError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-1">
          {authError}
          {isUnverifiedError && (
            <div className="mt-3 flex flex-col gap-2">
              <Link
                href={`${ROUTES.AUTH.VERIFY_EMAIL}?email=${encodeURIComponent(watchedEmail)}`}
                className="text-primary-green font-bold underline hover:no-underline"
              >
                Click here to verify your account
              </Link>
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={resendMutation.isPending || !watchedEmail}
                className="text-primary-green font-bold underline hover:no-underline text-left disabled:opacity-50"
              >
                {resendMutation.isPending ? "Resending..." : "Resend Verification Code"}
              </button>
            </div>
          )}
          {isNotFoundError && (
            <div className="mt-2 text-red-600">
              Don&apos;t have an account?{" "}
              <Link
                href={ROUTES.AUTH.SIGNUP}
                className="text-primary-green font-bold underline hover:no-underline"
              >
                Sign up here
              </Link>
            </div>
          )}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {/* Email Field */}
        <Input
          type="email"
          label="Email"
          error={errors.email?.message}
          variant="light"
          disabled={authLoading}
          placeholder="johndoe@example.com"
          {...register("email")}
        />

        {/* Password Field */}
        <div className="space-y-2">
          <PasswordInput
            label="Password"
            error={errors.password?.message}
            variant="light"
            disabled={authLoading}
            placeholder="............"
            {...register("password")}
          />
          <div className="flex justify-start">
            <Link
              href={ROUTES.AUTH.FORGOT_PASSWORD}
              className="text-sm font-semibold hover:underline text-primary-green pl-1"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {/* Log In Button */}
        <button
          type="submit"
          disabled={!isValid || authLoading}
          className={`w-full py-4 text-white font-bold rounded-full transition-all cursor-pointer disabled:cursor-not-allowed flex justify-center items-center gap-2
            ${isValid && !authLoading
              ? "bg-primary-green shadow-btn-primary hover:shadow-btn-hover hover:-translate-y-1 hover:brightness-90 active:scale-[0.98]"
              : "bg-primary-green/60 shadow-none"
            }`}
        >
          {authLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            "Log In"
          )}
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center py-2">
          <div className="grow border-t border-border-light"></div>
          <span className="shrink mx-4 text-xs font-medium text-text-main uppercase tracking-widest">
            Or continue with
          </span>
          <div className="grow border-t border-border-light"></div>
        </div>

        {/* Social Login*/}
        <div className="space-y-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={authLoading}
            className="w-full py-3.5 flex items-center justify-center gap-3 rounded-full border border-border-light bg-white hover:bg-gray-50 transition-all cursor-pointer font-semibold text-text-main shadow-sm hover:shadow-md disabled:opacity-50"
          >
            <FcGoogle size={27} />
            <span>Sign in with Google</span>
          </button>
        </div>

        {/* Footer Link */}
        <div className="text-center pt-2">
          <p className="text-base font-semibold text-text-main">
            Don&apos;t have an account?{" "}
            <Link
              href={ROUTES.AUTH.SIGNUP}
              className="font-bold hover:underline text-primary-green"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
