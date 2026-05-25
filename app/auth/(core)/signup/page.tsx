"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, SignUpInput } from "@/lib/validations/auth.schema";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import Checkbox from "@/components/ui/Checkbox";

export default function SignupPage() {
  const { signup, isLoading: authLoading, error: authError, clearError } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      agreedToTerms: false,
    },
  });

  const watchedAgreedToTerms = watch("agreedToTerms");

  const isAlreadyExistsError = useMemo(() => {
    if (!authError) return false;
    const lowerError = authError.toLowerCase();
    return lowerError.includes("exist") ||
      lowerError.includes("already") ||
      lowerError.includes("registered") ||
      lowerError.includes("conflict");
  }, [authError]);

  const handleGoogleSignup = () => {
    window.location.href = "/api/auth/google?mode=signup";
  };

  const onSubmit = async (data: SignUpInput) => {
    clearError();
    try {
      await signup({ email: data.email, password: data.password });
    } catch {
      // Error is managed globally by AuthContext
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl mb-4 font-bold text-gray-900 tracking-tight">
          Create an account
        </h1>
        <p className="text-gray-500 font-medium text-base">
          Start your journey with creators who get you.
        </p>
      </div>

      {authError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-1">
          {authError}
          {isAlreadyExistsError && (
            <div className="mt-2 text-red-600">
              Already have an account?{" "}
              <Link
                href={ROUTES.AUTH.LOGIN}
                className="text-primary-green font-bold underline hover:no-underline"
              >
                Log in here
              </Link>
            </div>
          )}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        {/* Email Field */}
        <Input
          type="email"
          label="Email"
          error={errors.email?.message}
          variant="light"
          disabled={authLoading}
          placeholder="abc@youremail.com"
          {...register("email")}
        />

        {/* Password Field */}
        <div className="space-y-1.5">
          <PasswordInput
            label="Password"
            error={errors.password?.message}
            variant="light"
            disabled={authLoading}
            placeholder="............"
            {...register("password")}
          />
          {!errors.password && (
            <p className="text-xs text-gray-400 mt-1 pl-3">
              At least 8 characters, include a number
            </p>
          )}
        </div>

        {/* Terms Checkbox */}
        <Checkbox
          checked={watchedAgreedToTerms}
          onChange={(checked) => setValue("agreedToTerms", checked, { shouldValidate: true })}
          disabled={authLoading}
          error={errors.agreedToTerms?.message}
          label={
            <>
              I have read and agree to Collabden&apos;s{" "}
              <Link
                href="#"
                className="underline font-semibold decoration-primary-green/30 hover:decoration-primary-green transition-colors text-primary-green"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                terms of use
              </Link>{" "}
              and{" "}
              <Link
                href="#"
                className="underline font-semibold decoration-primary-green/30 hover:decoration-primary-green transition-colors text-primary-green"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                privacy policy
              </Link>
            </>
          }
        />

        {/* Sign Up Button */}
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
            "Sign Up"
          )}
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center py-1">
          <div className="grow border-t border-border-light"></div>
          <span className="shrink mx-4 text-xs font-medium text-text-main uppercase tracking-widest">
            Or continue with
          </span>
          <div className="grow border-t border-border-light"></div>
        </div>

        {/* Social Login - Google Only */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={authLoading}
            className="w-full py-3.5 flex items-center justify-center gap-3 rounded-full border border-border-light bg-white hover:bg-gray-50 transition-all cursor-pointer font-semibold text-text-main shadow-sm hover:shadow-md disabled:opacity-50"
          >
            <FcGoogle size={27} />
            <span>Sign up with Google</span>
          </button>
        </div>

        {/* Footer Link */}
        <div className="text-center pt-1">
          <p className="text-base font-semibold text-text-main">
            Already have an account?{" "}
            <Link
              href={ROUTES.AUTH.LOGIN}
              className="font-bold hover:underline text-primary-green"
            >
              Log In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
