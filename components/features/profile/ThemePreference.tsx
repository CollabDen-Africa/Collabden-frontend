"use client";

import React, { useState, useEffect } from "react";
import { FiSun, FiMoon, FiMonitor, FiLayers } from "react-icons/fi";

interface ThemePreferenceProps {
  initialTheme?: string;
  onThemeChange?: (theme: string) => Promise<void>;
}

export default function ThemePreference({ initialTheme = "default", onThemeChange }: ThemePreferenceProps) {
  const [activeTheme, setActiveTheme] = useState<string>("default");
  const [isSaving, setIsSaving] = useState(false);

  // 1. Sync on mount (Prioritize backend initialTheme, fallback to localStorage)
  useEffect(() => {
    const savedLocalTheme = localStorage.getItem("app-theme");
    // If backend has a theme, and it differs from local, backend wins (device sync)
    const themeToApply = initialTheme && initialTheme !== "default" 
        ? initialTheme 
        : (savedLocalTheme || "default");
        
    setActiveTheme(themeToApply);
    applyThemeToDOM(themeToApply);
  }, [initialTheme]);

  // 2. DOM Manipulation Helper
  const applyThemeToDOM = (theme: string) => {
    const root = document.documentElement;
    if (theme === "system") {
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.setAttribute("data-theme", systemPrefersDark ? "dark" : "light");
    } else {
      root.setAttribute("data-theme", theme);
    }
  };

  // 3. Click Handler
  const handleThemeClick = async (theme: string) => {
    if (theme === activeTheme) return;

    // Optimistic Update: Instantly change UI and LocalStorage
    setActiveTheme(theme);
    applyThemeToDOM(theme);
    localStorage.setItem("app-theme", theme);

    // Backend Sync
    if (onThemeChange) {
      setIsSaving(true);
      try {
        await onThemeChange(theme);
      } catch (error) {
        console.error("Failed to sync theme with backend", error);
        // Optional: Revert theme if backend fails
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="w-full bg-glass-bg border-[1.6px] border-glass-border rounded-[35px] p-8.75 flex flex-col gap-5.75 backdrop-blur-md">
      <div className="flex justify-between items-center w-full">
        <span className="font-inter font-medium text-[20.5px] text-primary-blue">
          Theme Preference
        </span>
        {isSaving && (
          <span className="font-raleway text-[13px] text-text-muted-theme animate-pulse">
            Saving...
          </span>
        )}
      </div>

      <div className="flex flex-row flex-wrap gap-4.25">
        {/* DEFAULT THEME */}
        <button
          onClick={() => handleThemeClick("default")}
          className={`flex items-center gap-3 px-5.75 py-3 rounded-[23.5px] border-[1.6px] transition-all ${
            activeTheme === "default"
              ? "bg-primary-green border-primary-green text-white"
              : "bg-glass-bg border-glass-border text-text-muted-theme hover:border-foreground/30"
          }`}
        >
          <FiLayers size={20} className={activeTheme === "default" ? "text-white" : "text-text-muted-theme"} />
          <span className="font-inter font-medium text-[20.5px]">Default</span>
        </button>

        {/* LIGHT THEME */}
        <button
          onClick={() => handleThemeClick("light")}
          className={`flex items-center gap-3 px-5.75 py-3 rounded-[23.5px] border-[1.6px] transition-all ${
            activeTheme === "light"
              ? "bg-primary-green border-primary-green text-white"
              : "bg-glass-bg border-glass-border text-text-muted-theme hover:border-foreground/30"
          }`}
        >
          <FiSun size={20} className={activeTheme === "light" ? "text-white" : "text-text-muted-theme"} />
          <span className="font-inter font-medium text-[20.5px]">Light</span>
        </button>

        {/* DARK THEME */}
        <button
          onClick={() => handleThemeClick("dark")}
          className={`flex items-center gap-3 px-5.75 py-3 rounded-[23.5px] border-[1.6px] transition-all ${
            activeTheme === "dark"
              ? "bg-primary-green border-primary-green text-white"
              : "bg-glass-bg border-glass-border text-text-muted-theme hover:border-foreground/30"
          }`}
        >
          <FiMoon size={20} className={activeTheme === "dark" ? "text-white" : "text-text-muted-theme"} />
          <span className="font-inter font-medium text-[20.5px]">Dark</span>
        </button>

        {/* SYSTEM THEME */}
        <button
          onClick={() => handleThemeClick("system")}
          className={`flex items-center gap-3 px-5.75 py-3 rounded-[23.5px] border-[1.6px] transition-all ${
            activeTheme === "system"
              ? "bg-primary-green border-primary-green text-white"
              : "bg-glass-bg border-glass-border text-text-muted-theme hover:border-foreground/30"
          }`}
        >
          <FiMonitor size={20} className={activeTheme === "system" ? "text-white" : "text-text-muted-theme"} />
          <span className="font-inter font-medium text-[20.5px]">System</span>
        </button>
      </div>
    </div>
  );
}