"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProjectSchema, CreateProjectInput } from "@/lib/validations/project.schema";
import {
  HiOutlineSearch,
  HiOutlineLockClosed,
  HiOutlineGlobeAlt,
  HiCheck,
  HiPaperAirplane,
  HiX
} from "react-icons/hi";

import DatePicker from "@/components/ui/DatePicker";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { useProjects } from "@/hooks/projects/useProjects";
import { useCollaborator } from "@/hooks/collaborator/useCollaborator";
import { useProfile } from "@/hooks/profile/useProfile";
import { useDebounce } from "@/hooks/useDebounce";
import { ROUTES } from "@/constants/routes";
import { getErrorMessage } from "@/lib/error-handler";

interface ProjectDateFieldProps {
  label: string;
  selectedDate: Date | null | undefined;
  onSelect: (date: Date | null) => void;
  error?: string;
  dropdownMode?: "overlay" | "inline";
  minDate?: Date;
}

function ProjectDateField({
  label,
  selectedDate,
  onSelect,
  error,
  dropdownMode,
  minDate,
}: ProjectDateFieldProps) {
  return (
    <div className="flex flex-col gap-2 relative z-40">
      <label className="text-sm font-semibold pl-1 text-white">{label}</label>
      <DatePicker
        selectedDate={selectedDate}
        onSelect={onSelect}
        dropdownMode={dropdownMode}
        minDate={minDate}
      />
      {error && <p className="text-xs text-red-400 font-medium pl-4 mt-1">{error}</p>}
    </div>
  );
}

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
      deadlineDate: undefined,
      visibility: "PRIVATE",
      openToCollaborators: false,
      selectedCollabs: [],
    },
  });

  const watchedGenre = watch("selectedGenre");
  const watchedDate = watch("selectedDate");
  const watchedDeadline = watch("deadlineDate");
  const watchedCollabs = watch("selectedCollabs");
  const watchedVisibility = watch("visibility");
  const watchedOpenToCollaborators = watch("openToCollaborators");

  const [isCollabOpen, setIsCollabOpen] = useState(false);
  const [collaboratorSearch, setCollaboratorSearch] = useState("");
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [selectedCollabMap, setSelectedCollabMap] = useState<
    Record<string, { id: string; name: string; avatarUrl?: string }>
  >({});
  const debouncedSearch = useDebounce(collaboratorSearch, 300);

  const { useCreateProject } = useProjects();
  const { useCollaborators, useMarketplaceGenres } = useCollaborator();
  const { useCurrentProfile } = useProfile();
  const { data: currentProfile } = useCurrentProfile();
  const currentUserId = currentProfile?.id;

  const createProjectMutation = useCreateProject();
  const {
    data: rawCollaborators = [],
    isLoading: isLoadingCollaborators,
    isError: isCollaboratorsError,
    error: collaboratorsError,
  } = useCollaborators({
    name: debouncedSearch || undefined,
    connectedOnly: true,
  });
  const { data: genres = [], isLoading: isLoadingGenres } = useMarketplaceGenres();

  const collaborators = useMemo(() => {
    if (!rawCollaborators) return [];
    return rawCollaborators.filter(
      (c) => c.id !== currentUserId && (c as any).userId !== currentUserId
    );
  }, [rawCollaborators, currentUserId]);

  // Cache fetched collaborator details in map so selected pills display even if search changes
  useEffect(() => {
    if (collaborators.length > 0) {
      setSelectedCollabMap((prev) => {
        const updated = { ...prev };
        let changed = false;
        collaborators.forEach((c) => {
          if (!updated[c.id]) {
            const name = c.displayName || c.legalName || c.email.split("@")[0];
            updated[c.id] = { id: c.id, name, avatarUrl: c.avatarUrl };
            changed = true;
          }
        });
        return changed ? updated : prev;
      });
    }
  }, [collaborators]);

  const toggleCollaborator = (id: string) => {
    const current = watchedCollabs || [];
    const isAdded = current.includes(id);
    const next = isAdded
      ? current.filter((collaboratorId) => collaboratorId !== id)
      : [...current, id];
    setValue("selectedCollabs", next, { shouldValidate: true });
  };

  const removeCollaborator = (id: string) => {
    const current = watchedCollabs || [];
    const next = current.filter((collaboratorId) => collaboratorId !== id);
    setValue("selectedCollabs", next, { shouldValidate: true });
  };

  const onSubmit = async (data: CreateProjectInput) => {
    setSubmissionError(null);
    createProjectMutation.reset();
    try {
      await createProjectMutation.mutateAsync({
        name: data.projectName.trim(),
        description: data.description?.trim() || undefined,
        genre: data.selectedGenre,
        startDate: data.selectedDate.toISOString(),
        endDate: data.deadlineDate?.toISOString(),
        visibility: data.visibility,
        openToCollaborators: data.openToCollaborators,
        collaboratorIds: data.selectedCollabs,
      });
      router.push(ROUTES.PROJECTS.SUCCESS);
    } catch (err) {
      console.error("Project creation failed:", err);
      setSubmissionError(getErrorMessage(err));
    }
  };

  const errorMessage = submissionError || (createProjectMutation.error ? getErrorMessage(createProjectMutation.error) : null);
  const requiresProfileSetup = Boolean(errorMessage && /identity verification|legal name/i.test(errorMessage));

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

            {/* Genre, Start Date & Deadline Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

              {/* Genre Dropdown Select */}
              <Select
                label="Genre / Category"
                value={watchedGenre || ""}
                onChange={(val) => setValue("selectedGenre", val, { shouldValidate: true })}
                options={genres}
                placeholder="Select genre"
                error={errors.selectedGenre?.message}
                variant="glass"
                disabled={isLoadingGenres}
              />

              <ProjectDateField
                label="Start Date"
                selectedDate={watchedDate || null}
                onSelect={(date) => setValue("selectedDate", date || undefined, { shouldValidate: true })}
                error={errors.selectedDate?.message}
                minDate={new Date()}
              />

              <ProjectDateField
                label="Deadline"
                selectedDate={watchedDeadline || null}
                onSelect={(date) => setValue("deadlineDate", date || undefined, { shouldValidate: true })}
                error={errors.deadlineDate?.message}
                minDate={watchedDate || new Date()}
              />
            </div>

            {/* Collaborators */}
            <div className="flex flex-col gap-4 relative">
              <div className="flex items-center justify-between">
                <label className="font-sans font-semibold text-[18px] text-white">
                  Collaborators
                </label>
                {watchedCollabs && watchedCollabs.length > 0 && (
                  <span className="font-sans text-[13px] text-primary-green font-medium">
                    {watchedCollabs.length} selected
                  </span>
                )}
              </div>

              {/* Selected Collaborators Preview List */}
              {watchedCollabs && watchedCollabs.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-white/5 border border-white/15 rounded-[20px] backdrop-blur-md animate-in fade-in duration-200">
                  {watchedCollabs.map((id) => {
                    const details = selectedCollabMap[id];
                    const displayName = details?.name || "Collaborator";
                    return (
                      <div
                        key={id}
                        className="flex items-center gap-2 bg-primary-green/20 border border-primary-green/40 hover:border-primary-green/60 rounded-full px-3 py-1.5 transition-all duration-200"
                      >
                        <Avatar name={displayName} src={details?.avatarUrl} className="w-[20px] h-[20px]" />
                        <span className="font-sans font-semibold text-[13px] text-white">
                          {displayName}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeCollaborator(id)}
                          className="text-white/60 hover:text-white hover:bg-white/20 rounded-full p-0.5 transition-colors ml-0.5"
                          aria-label={`Remove ${displayName}`}
                        >
                          <HiX size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

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
                      {collaborators.map((collab) => {
                        const isAdded = watchedCollabs.includes(collab.id);
                        const name = collab.displayName || collab.legalName || collab.email.split("@")[0];

                        return (
                          <div
                            key={collab.id}
                            onClick={() => toggleCollaborator(collab.id)}
                            className={`flex items-center justify-between w-[98%] h-[46px] px-[14px] py-[10px] rounded-[50px] cursor-pointer transition-colors group ${isAdded ? "bg-primary-green" : "hover:bg-primary-green"
                              }`}
                          >
                            {/* Avatar & Text */}
                            <div className="flex items-center gap-[8px]">
                              <Avatar
                                name={name}
                                src={collab.avatarUrl}
                                className="w-[24px] h-[24px]"
                              />
                              <span className="font-sans font-bold text-[16px] leading-[19px] text-white">
                                {name}
                              </span>
                            </div>

                            {/* Select an available collaborator to invite after creation. */}
                            <Button
                              type="button"
                              variant="ghost"
                              className={`w-[88px]! h-[26px]! rounded-[30px]! flex items-center justify-center gap-[4px] px-0! py-0! transition-colors ${isAdded
                                  ? "bg-white text-primary-green"
                                  : "bg-white/10 text-white hover:bg-white/20"
                                }`}
                            >
                              {isAdded ? (
                                <HiCheck size={12} className="stroke-[2px]" />
                              ) : (
                                <HiPaperAirplane size={12} />
                              )}
                              <span className="font-sans font-medium text-[12px] leading-[24px]">
                                {isAdded ? "Selected" : "Invite"}
                              </span>
                            </Button>
                          </div>
                        );
                      })}
                      {isLoadingCollaborators && (
                        <div className="text-center py-4 text-white/50 text-[14px] font-sans">Loading collaborators…</div>
                      )}
                      {!isLoadingCollaborators && isCollaboratorsError && (
                        <div className="text-center py-4 text-red-300 text-[14px] font-sans">
                          Unable to load collaborators: {getErrorMessage(collaboratorsError)}
                        </div>
                      )}
                      {!isLoadingCollaborators && !isCollaboratorsError && collaborators.length === 0 && (
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
                  onClick={() => {
                    setValue("visibility", "PRIVATE", { shouldValidate: true });
                    setValue("openToCollaborators", false, { shouldValidate: true });
                  }}
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

            {/* Marketplace Availability */}
            <div className="flex flex-col gap-3 rounded-[20px] border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <label htmlFor="open-to-collaborators" className="font-sans font-medium text-[16px] text-white">
                    Open to collaborators
                  </label>
                  <p className="mt-1 font-sans text-[13px] text-white/60">
                    List this project in the marketplace for collaborators to discover.
                  </p>
                </div>
                <button
                  id="open-to-collaborators"
                  type="button"
                  role="switch"
                  aria-checked={watchedOpenToCollaborators}
                  onClick={() => {
                    const nextValue = !watchedOpenToCollaborators;
                    setValue("openToCollaborators", nextValue, { shouldValidate: true });
                    if (nextValue) setValue("visibility", "PUBLIC", { shouldValidate: true });
                  }}
                  className={`relative h-7 w-12 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
                    watchedOpenToCollaborators ? "bg-primary-green" : "bg-white/20"
                  }`}
                >
                  <span
                    className={`pointer-events-none absolute left-1 top-1 h-5 w-5 rounded-full bg-white transition-transform ${
                      watchedOpenToCollaborators ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
              {watchedOpenToCollaborators && (
                <p className="font-sans text-[13px] text-primary-green">
                  Your visibility has been set to Public so this project can appear in the marketplace.
                </p>
              )}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-[16px] text-sm font-medium">
                <p>{errorMessage}</p>
                {requiresProfileSetup && (
                  <p className="mt-2 text-red-200/90">
                    Add your legal name in <Link href="/profile-settings" className="font-semibold underline underline-offset-2 hover:text-white">Account Settings</Link> and complete identity verification before trying again.
                  </p>
                )}
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
