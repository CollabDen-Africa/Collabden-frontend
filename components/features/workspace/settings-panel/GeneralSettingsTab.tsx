"use client";

import React, { useEffect } from "react";
import { FiSliders } from "react-icons/fi";
import DatePicker from "@/components/ui/DatePicker";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Project } from "@/types/api.types";
import { useProjects } from "@/hooks/projects/useProjects";

const generalSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100),
  description: z.string().max(120, "Description cannot exceed 120 characters").optional().or(z.literal("")),
  startDate: z.date({ message: "Due date is required" }),
});

type GeneralInput = z.infer<typeof generalSchema>;

interface GeneralSettingsTabProps {
  project?: Project;
}

export default function GeneralSettingsTab({ project }: GeneralSettingsTabProps) {
  const { useUpdateProject } = useProjects();
  const updateMutation = useUpdateProject(project?.id || "");

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
      startDate: project?.startDate ? new Date(project.startDate) : new Date(),
    },
  });

  // Keep form fields synced if project prop changes
  useEffect(() => {
    if (project) {
      setValue("name", project.name);
      setValue("description", project.description || "");
      if (project.startDate) {
        setValue("startDate", new Date(project.startDate));
      }
    }
  }, [project, setValue]);

  const onSubmit = async (data: GeneralInput) => {
    if (!project?.id) return;
    try {
      await updateMutation.mutateAsync({
        name: data.name,
        description: data.description,
        startDate: data.startDate.toISOString(),
      });
    } catch (err) {
      console.error("Failed to update general settings:", err);
    }
  };

  const descriptionValue = watch("description") || "";
  const startDateValue = watch("startDate");
  const MAX_DESC_LENGTH = 120;

  if (!project) {
    return (
      <div className="w-full max-w-[931px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-[40px] lg:rounded-[50px] p-[32px] lg:p-[48px] shadow-2xl flex items-center justify-center">
        <p className="text-white/60">No active project selected.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-[931px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-[40px] lg:rounded-[50px] p-[32px] lg:p-[48px] shadow-2xl animate-in fade-in slide-in-from-right-8 duration-500"
    >
      <div className="flex flex-col gap-[32px] lg:gap-[40px] w-full max-w-[860px]">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center p-[20px] lg:p-[24px] gap-[16px] bg-black/10 rounded-[30px] border border-white/5 shadow-inner">
          <div className="w-[54px] h-[54px] bg-white/20 rounded-[15px] flex items-center justify-center shrink-0 border border-white/10 shadow-sm">
            <FiSliders className="text-white" size={24} />
          </div>
          <div className="flex flex-col justify-center gap-[4px]">
            <h2 className="font-raleway font-semibold text-[22px] lg:text-[25px] leading-[29px] text-white">
              General
            </h2>
            <p className="font-raleway font-medium text-[15px] lg:text-[18px] leading-[21px] text-white/60">
              Core information about your project, visible to everyone you collaborate with.
            </p>
          </div>
        </div>

        {/* Project Name Field */}
        <div className="flex flex-col gap-[16px] w-full">
          <div className="flex flex-col gap-[4px] lg:gap-[8px]">
            <label className="font-raleway font-semibold text-[16px] lg:text-[18px] text-white">
              Project Name
            </label>
            <span className="font-raleway font-normal text-[14px] lg:text-[15px] text-white/60">
              Shown to all collaborators and on shared links.
            </span>
          </div>

          <div className="w-full h-[50px] bg-white/10 border border-transparent focus-within:border-primary-green focus-within:bg-white/15 rounded-full flex items-center px-[24px] transition-all duration-300 shadow-sm">
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

        {/* Description Field */}
        <div className="flex flex-col gap-[16px] w-full">
          <div className="flex flex-col gap-[4px] lg:gap-[8px]">
            <label className="font-raleway font-semibold text-[16px] lg:text-[18px] text-white">
              Description
            </label>
            <span className="font-raleway font-normal text-[14px] lg:text-[15px] text-white/60">
              A short summary of what this project is about.
            </span>
          </div>

          <div className="flex flex-col gap-[8px] w-full">
            <div className="w-full min-h-[118px] bg-white/10 border border-transparent focus-within:border-primary-green focus-within:bg-white/15 rounded-[30px] p-[24px] lg:p-[32px] transition-all duration-300 shadow-sm">
              <textarea
                maxLength={MAX_DESC_LENGTH}
                className="w-full h-full min-h-[70px] bg-transparent border-none outline-none font-raleway font-medium text-[16px] leading-[24px] text-white placeholder:text-white/40 resize-none custom-scrollbar"
                placeholder="Describe your project..."
                {...register("description")}
              />
            </div>

            {/* Character Count & Error Message */}
            <div className="w-full flex justify-between items-center px-[8px]">
              <div>
                {errors.description && (
                  <span className="text-red-400 font-sans text-[12px]">
                    {errors.description.message}
                  </span>
                )}
              </div>
              <span className="font-sans font-medium text-[12px] text-[#8B9092]">
                {descriptionValue.length}/{MAX_DESC_LENGTH}
              </span>
            </div>
          </div>
        </div>

        {/* Due Date Field */}
        <div className="flex flex-col gap-[16px] w-full lg:w-[403px]">
          <div className="flex flex-col gap-[4px] lg:gap-[8px]">
            <label className="font-raleway font-semibold text-[16px] text-white">
              Due Date
            </label>
            <span className="font-raleway font-normal text-[14px] lg:text-[15px] text-white/60">
              Help collaborators see your target delivery.
            </span>
          </div>

          <DatePicker
            selectedDate={startDateValue}
            onSelect={(date) => setValue("startDate", date || new Date(), { shouldValidate: true })}
            className="w-full"
          />
          {errors.startDate && (
            <span className="text-red-400 font-sans text-[12px]">
              {errors.startDate.message}
            </span>
          )}
        </div>

        {/* Action Button */}
        <div className="w-full flex justify-end mt-[20px]">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="bg-primary-green hover:bg-accent-green-success text-white font-sans font-semibold text-[16px] px-[32px] py-[12px] rounded-full transition-all duration-300 shadow-[0_4px_14px_rgba(115,191,68,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
      </div>
    </form>
  );
}