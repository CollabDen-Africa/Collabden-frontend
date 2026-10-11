"use client";

import React, { useEffect, useState } from "react";
import { FiSliders } from "react-icons/fi";
import { HiX } from "react-icons/hi";
import DatePicker from "@/components/ui/DatePicker";
import Select from "@/components/ui/Select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Project } from "@/types/api.types";
import { useProjects } from "@/hooks/projects/useProjects";
import { ProjectCoverUpload } from "../ProjectCoverUpload";

const generalSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100),
  description: z.string().max(120, "Description cannot exceed 120 characters").optional().or(z.literal("")),
  endDate: z.date({ message: "Due date is required" }),
  requiredRoles: z.array(z.string()).optional(),
  budget: z.union([z.string(), z.number()]).optional(),
  pricingType: z.string().optional(),
});

type GeneralInput = z.infer<typeof generalSchema>;

interface GeneralSettingsTabProps {
  project?: Project;
  onSuccess?: () => void;
}

export default function GeneralSettingsTab({ project, onSuccess }: GeneralSettingsTabProps) {
  const { useUpdateProject } = useProjects();
  const updateMutation = useUpdateProject(project?.id || "");
  const [roleInput, setRoleInput] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GeneralInput>({
    resolver: zodResolver(generalSchema),
    defaultValues: {
      name: project?.name || "",
      description: project?.description || "",
      endDate: project?.endDate ? new Date(project.endDate) : new Date(),
      requiredRoles: project?.requiredRoles || [],
      budget: project?.budget || "",
      pricingType: project?.pricingType || "fixed",
    },
  });

  const watchedRoles = watch("requiredRoles") || [];
  const watchedPricingType = watch("pricingType") || "fixed";

  // Keep form fields synced if project prop changes
  useEffect(() => {
    if (project) {
      setValue("name", project.name);
      setValue("description", project.description || "");
      setValue("requiredRoles", project.requiredRoles || []);
      setValue("budget", project.budget || "");
      setValue("pricingType", project.pricingType || "fixed");
      if (project.endDate) {
        setValue("endDate", new Date(project.endDate));
      }
    }
  }, [project, setValue]);

  const handleRoleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && roleInput.trim()) {
        e.preventDefault();
        if (!watchedRoles.includes(roleInput.trim())) {
          setValue("requiredRoles", [...watchedRoles, roleInput.trim()], { shouldValidate: true });
        }
        setRoleInput("");
      }
    };
  
    const removeRole = (roleToRemove: string) => {
      setValue("requiredRoles", watchedRoles.filter(r => r !== roleToRemove), { shouldValidate: true });
    };

  const onSubmit = async (data: GeneralInput) => {
    if (!project?.id) return;
    try {
      await updateMutation.mutateAsync({
        name: data.name,
        description: data.description,
        endDate: data.endDate.toISOString(),
        requiredRoles: data.requiredRoles,
        budget: data.budget ? Number(data.budget) : null,
        pricingType: data.pricingType,
      });
      onSuccess?.();
    } catch (err) {
      console.error("Failed to update general settings:", err);
    }
  };

  const endDateValue = watch("endDate");

  if (!project) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-white/60">No active project selected.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full flex flex-col gap-7 lg:gap-8"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center p-5 lg:p-6 pr-[56px] sm:pr-16 gap-4 bg-black/20 rounded-3xl border border-white/5 shadow-inner">
        <div className="w-13.5 h-13.5 bg-white/10 rounded-[15px] flex items-center justify-center shrink-0 border border-white/10 shadow-sm">
          <FiSliders className="text-white" size={24} />
        </div>
        <div className="flex flex-col justify-center gap-1">
          <h2 className="font-raleway font-semibold text-[22px] lg:text-[25px] leading-7.25 text-white">
            General
          </h2>
          <p className="font-raleway font-medium text-[14px] lg:text-[16px] leading-5.25 text-white/60">
            Core information about your project, visible to everyone you collaborate with.
          </p>
        </div>
      </div>

      {/* Project Name Field */}
      <div className="flex flex-col gap-3 w-full">
        <div className="flex flex-col gap-1">
          <label className="font-raleway font-semibold text-[16px] lg:text-[18px] text-white">
            Project Name
          </label>
          <span className="font-raleway font-normal text-[13px] lg:text-[14px] text-white/60">
            Shown to all collaborators and on shared links.
          </span>
        </div>

        <div className="w-full h-12.5 bg-black/20 border border-white/10 focus-within:border-primary-green focus-within:bg-black/30 rounded-full flex items-center px-6 transition-all duration-300 shadow-sm">
          <input
            type="text"
            className="w-full bg-transparent border-none outline-none font-raleway font-medium text-[16px] text-white placeholder:text-white/40"
            placeholder="Enter project name..."
            {...register("name")}
          />
        </div>
        {errors.name && (
          <span className="text-red-400 font-sans text-[12px]">{errors.name.message}</span>
        )}
      </div>

        {/* Cover Image Upload */}
        <ProjectCoverUpload projectId={project.id} currentCoverUrl={project.coverImageUrl} />


      {/* Description Field */}
      <div className="flex flex-col gap-3 w-full">
        <div className="flex flex-col gap-1">
          <label className="font-raleway font-semibold text-[16px] lg:text-[18px] text-white">
            Description
          </label>
          <span className="font-raleway font-normal text-[13px] lg:text-[14px] text-white/60">
            A short summary of what this project is about.
          </span>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="w-full min-h-30 bg-black/20 border border-white/10 focus-within:border-primary-green focus-within:bg-black/30 rounded-3xl p-5 lg:p-6 transition-all duration-300 shadow-sm">
            <textarea
              className="w-full h-full min-h-20 bg-transparent border-none outline-none font-raleway font-medium text-[15px] leading-6 text-white placeholder:text-white/40 resize-none custom-scrollbar"
              placeholder="Describe your project..."
              {...register("description")}
            />
          </div>

          {errors.description && (
            <div className="w-full px-2">
              <span className="text-red-400 font-sans text-[12px]">
                {errors.description.message}
              </span>
            </div>
          )}
        </div>
      </div>

        {/* Required Roles Field */}
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-1 lg:gap-2">
            <label className="font-raleway font-semibold text-[16px] lg:text-[18px] text-white">
                Open Roles
            </label>
              <span className="font-raleway font-normal text-[14px] lg:text-[15px] text-white/60">
                Roles you are actively seeking on the marketplace. Press Enter to add.
              </span>
          </div>
        
          <div className="w-full min-h-12.5 bg-white/10 border border-transparent focus-within:border-primary-green focus-within:bg-white/15 rounded-3xl p-3 flex flex-wrap gap-2 transition-all duration-300 shadow-sm">
                    {watchedRoles.map((role) => (
                      <span key={role} className="flex items-center gap-2 bg-primary-green/20 border border-primary-green/50 text-white px-3 py-1 rounded-full text-[14px]">
                        {role}
                        <button type="button" onClick={() => removeRole(role)} className="hover:text-red-400">
                          <HiX size={14} />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={roleInput}
                      onChange={(e) => setRoleInput(e.target.value)}
                      onKeyDown={handleRoleKeyDown}
                      placeholder={watchedRoles.length === 0 ? "e.g., Bassist, Mix Engineer..." : ""}
                      className="flex-1 bg-transparent border-none outline-none font-raleway font-medium text-[16px] text-white placeholder:text-white/40 min-w-37.5"
                    />
                  </div>
      </div>

      {/* Compensation & Budget Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1 lg:gap-2">
              <label className="font-raleway font-semibold text-[16px] lg:text-[18px] text-white">
                Pricing Type
              </label>
              <span className="font-raleway font-normal text-[14px] lg:text-[15px] text-white/60">
                      How contributors are compensated.
                    </span>
                  </div>
                  <Select
                    options={[
                      { label: "Fixed Price", value: "fixed" },
                      { label: "Hourly Rate", value: "hourly" }
                    ]}
                    value={watchedPricingType}
                    onChange={(val) => setValue("pricingType", val, { shouldValidate: true })}
                    variant="glass"
                  />
                </div>
      
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1 lg:gap-2">
                    <label className="font-raleway font-semibold text-[16px] lg:text-[18px] text-white">
                      Total Budget
                    </label>
                    <span className="font-raleway font-normal text-[14px] lg:text-[15px] text-white/60">
                      The maximum allocation for this project.
                    </span>
                  </div>
                  <div className="w-full h-12.5 bg-white/10 border border-transparent focus-within:border-primary-green focus-within:bg-white/15 rounded-full flex items-center px-6 transition-all duration-300 shadow-sm">
                    <input
                      type="number"
                      className="w-full bg-transparent border-none outline-none font-raleway font-medium text-[16px] text-white placeholder:text-white/40"
                      placeholder="e.g. 5000"
                      {...register("budget")}
                    />
                  </div>
                </div>
              </div>

        {/* Due Date Field */}
        <div className="flex flex-col gap-4 w-full lg:w-100.75">
          <div className="flex flex-col gap-1 lg:gap-2">
            <label className="font-raleway font-semibold text-[16px] text-white">
              Due Date
            </label>
            <span className="font-raleway font-normal text-[14px] lg:text-[15px] text-white/60">
              Help collaborators see your target delivery.
            </span>
          </div>

          <DatePicker
            selectedDate={endDateValue}
            onSelect={(date) => setValue("endDate", date || new Date(), { shouldValidate: true })}
            className="w-full"
          />
          {errors.endDate && (
            <span className="text-red-400 font-sans text-[12px]">
              {errors.endDate.message}
            </span>
          )}
        </div>

        {/* Action Button */}
        <div className="w-full flex justify-end mt-5">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="bg-primary-green hover:bg-accent-green-success text-white font-sans font-semibold text-[16px] px-8 py-3 rounded-full transition-all duration-300 shadow-[0_4px_14px_rgba(115,191,68,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {updateMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
    </form>
  );
}