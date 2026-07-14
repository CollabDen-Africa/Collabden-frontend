"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProjectSchema, CreateProjectInput } from "@/lib/validations/project.schema";
import {
  HiOutlineSearch,
  HiOutlineLockClosed,
  HiOutlineGlobeAlt,
  HiCheck,
  HiOutlineUserAdd,
  HiPaperAirplane
} from "react-icons/hi";

import DatePicker from "@/components/ui/DatePicker";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { PROJECT_GENRES, MOCK_COLLABORATORS } from "@/lib/mockData";
import { useProjects } from "@/hooks/projects/useProjects";
import { ROUTES } from "@/constants/routes";

export default function CreateProjectPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      projectName: "",
      description: "",
      selectedGenre: "",
      selectedDate: undefined,
      visibility: "PRIVATE",
      selectedCollabs: [],
    },
  });

  const watchedGenre = watch("selectedGenre");
  const watchedDate = watch("selectedDate");
  const watchedCollabs = watch("selectedCollabs");
  const watchedVisibility = watch("visibility");

  const [isCollabOpen, setIsCollabOpen] = useState(false);
  const [collaboratorSearch, setCollaboratorSearch] = useState("");

  const { useCreateProject } = useProjects();
  const createProjectMutation = useCreateProject();

  const toggleCollaborator = (name: string) => {
    const current = watchedCollabs || [];
    const next = current.includes(name)
      ? current.filter(n => n !== name)
      : [...current, name];
    setValue("selectedCollabs", next, { shouldValidate: true });
  };

  const filteredCollabs = MOCK_COLLABORATORS.filter(c =>
    c.name.toLowerCase().includes(collaboratorSearch.toLowerCase())
  );

  const onSubmit = async (data: CreateProjectInput) => {
    try {
      await createProjectMutation.mutateAsync({
        name: data.projectName.trim(),
        description: data.description?.trim() || undefined,
        genre: data.selectedGenre,
        startDate: data.selectedDate.toISOString(),
        visibility: data.visibility,
      });
      router.push(ROUTES.PROJECTS.SUCCESS);
    } catch (err) {
      console.error("Project creation failed:", err);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-start justify-center pb-20 pt-4 px-4 sm:px-6 lg:px-8">

      {/* Main Form Container */}
      <div className="w-full max-w-[1008px] bg-white/10 backdrop-blur-md border border-white/20 rounded-[30px] md:rounded-[50px] p-6 sm:p-10 lg:p-[80px] shadow-2xl relative overflow-visible z-10">

        <div className="w-full max-w-[765px] mx-auto flex flex-col gap-8 md:gap-12">

          <div className="flex flex-col gap-2">
            <h1 className="font-sans font-semibold text-[28px] md:text-[32px] leading-tight text-white">
              Create New Project
            </h1>
            <p className="font-sans font-medium text-[16px] md:text-[18px] leading-tight text-white/90">
              Set up your project and start collaborating with ease
            </p>
          </div>

          <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>

            {/* Project Name */}
            <Input
              type="text"
              label="Project Name"
              error={errors.projectName?.message}
              variant="glass"
              placeholder="Enter project name"
              {...register("projectName")}
            />

            {/* Description */}
            <div className="flex flex-col gap-4">
              <label className="font-sans font-semibold text-[18px] pl-1 text-white">
                Description (optional)
              </label>
              <textarea
                placeholder="Describe your project..."
                {...register("description")}
                className="w-full h-44.5 bg-white/10 border border-white/20 hover:border-primary-green focus:border-primary-green rounded-3x1 p-6 font-sans font-medium text-[16px] text-white placeholder-white/50 resize-none outline-none transition-all duration-300"
              />
              {errors.description && (
                <p className="text-xs text-red-400 font-medium pl-4 mt-0.5">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Genre & Start Date Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

              {/* Genre Dropdown Select */}
              <Select
                label="Genre / Category"
                value={watchedGenre || ""}
                onChange={(val) => setValue("selectedGenre", val, { shouldValidate: true })}
                options={PROJECT_GENRES}
                placeholder="Select genre"
                error={errors.selectedGenre?.message}
                variant="glass"
              />

              {/* Start Date */}
              <div className="flex flex-col gap-2 relative z-30">
                <label className="text-sm font-semibold pl-1 text-white">
                  Start Date
                </label>
                <DatePicker
                  selectedDate={watchedDate || null}
                  onSelect={(date) => setValue("selectedDate", date || undefined, { shouldValidate: true })}
                />
                {errors.selectedDate && (
                  <p className="text-xs text-red-400 font-medium pl-4 mt-1">
                    {errors.selectedDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* Collaborators */}
            <div className="flex flex-col gap-4 relative">
              <label className="font-sans font-semibold text-[18px] text-white">
                Collaborators
              </label>
              <div className={`w-full h-[50px] bg-white/10 border rounded-full px-6 flex items-center gap-3 relative z-20 transition-all duration-300 ${isCollabOpen ? "border-primary-green" : "border-white/20 hover:border-primary-green"
                }`}>
                <HiOutlineSearch className="text-white/50" size={20} />
                <input
                  type="text"
                  placeholder="Search collaborators"
                  value={collaboratorSearch}
                  onChange={(e) => { setCollaboratorSearch(e.target.value); setIsCollabOpen(true); }}
                  onFocus={() => setIsCollabOpen(true)}
                  className="bg-transparent border-none outline-none w-full font-sans font-medium text-[16px] text-white placeholder-white/50"
                />
              </div>

              {isCollabOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsCollabOpen(false)} />
                  <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#121A1F]/90 backdrop-blur-2xl border border-white/20 rounded-[20px] py-[4px] shadow-[0px_12px_16px_-4px_rgba(10,13,18,0.08),0px_4px_6px_-2px_rgba(10,13,18,0.03)] z-30 max-h-[320px] overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex flex-col items-center">
                      {filteredCollabs.map((collab, i) => {
                        const isAdded = watchedCollabs.includes(collab.name);

                        // Connect and Invite button logic
                        const isConnect = i % 2 !== 0;
                        const actionType = isConnect ? "Connect" : "Invite";
                        const addedText = isConnect ? "Connected" : "Invited";

                        return (
                          <div
                            key={i}
                            onClick={() => toggleCollaborator(collab.name)}
                            className={`flex items-center justify-between w-[98%] h-[46px] px-[14px] py-[10px] rounded-[50px] cursor-pointer transition-colors group ${isAdded ? "bg-primary-green" : "hover:bg-primary-green"
                              }`}
                          >
                            {/* Avatar & Text */}
                            <div className="flex items-center gap-[8px]">
                              <Avatar
                                name={collab.name}
                                src={collab.image}
                                className="w-[24px] h-[24px]"
                              />
                              <span className="font-sans font-bold text-[16px] leading-[19px] text-white">
                                {collab.name}
                              </span>
                            </div>

                            {/* Buttons for Invite and Connect */}
                            <Button
                              type="button"
                              variant="ghost"
                              className={`w-[88px]! h-[26px]! rounded-[30px]! flex items-center justify-center gap-[4px] px-0! py-0! transition-colors ${isAdded
                                  ? "bg-white text-primary-green"
                                  : isConnect
                                    ? "bg-white text-primary-green shadow-sm hover:brightness-95"
                                    : "bg-white/10 text-white hover:bg-white/20"
                                }`}
                            >
                              {isAdded ? (
                                <HiCheck size={12} className="stroke-[2px]" />
                              ) : isConnect ? (
                                <HiOutlineUserAdd size={14} />
                              ) : (
                                <HiPaperAirplane size={12} />
                              )}
                              <span className="font-sans font-medium text-[12px] leading-[24px]">
                                {isAdded ? addedText : actionType}
                              </span>
                            </Button>
                          </div>
                        );
                      })}
                      {filteredCollabs.length === 0 && (
                        <div className="text-center py-4 text-white/50 text-[14px] font-sans">
                          No collaborators found
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Visibility */}
            <div className="flex flex-col gap-3">
              <label className="font-sans font-medium text-[16px] text-white">
                Visibility
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setValue("visibility", "PRIVATE", { shouldValidate: true })}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full font-sans font-medium text-[14px] transition-all duration-300 ${watchedVisibility === "PRIVATE"
                      ? "bg-primary-green/10 border border-primary-green text-white"
                      : "bg-white/10 border border-transparent text-white hover:border-primary-green hover:bg-white/15"
                    }`}
                >
                  <HiOutlineLockClosed size={16} />
                  Private
                </button>
                <button
                  type="button"
                  onClick={() => setValue("visibility", "PUBLIC", { shouldValidate: true })}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full font-sans font-medium text-[14px] transition-all duration-300 ${watchedVisibility === "PUBLIC"
                      ? "bg-primary-green/10 border border-primary-green text-white"
                      : "bg-white/10 border border-transparent text-white hover:border-primary-green hover:bg-white/15"
                    }`}
                >
                  <HiOutlineGlobeAlt size={16} />
                  Public
                </button>
              </div>
              <span className="font-sans font-medium text-[13px] text-white/60">
                You can invite up to 5 collaborators on the free plan
              </span>
            </div>

            {/* Error Message */}
            {createProjectMutation.error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-[16px] text-sm font-medium">
                {createProjectMutation.error instanceof Error ? createProjectMutation.error.message : "Failed to create project"}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 mt-4 pt-8 border-t border-white/10">
              <Button
                type="button"
                variant="ghost"
                className="bg-white/10 hover:bg-white/20 px-6! py-2! h-auto! text-[14px] font-medium"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={createProjectMutation.isPending}
                className="border border-accent-soft-green px-6! py-2! h-auto! text-[14px] font-medium"
              >
                {createProjectMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </div>
                ) : (
                  "Create project"
                )}
              </Button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}