"use client";

import { FormEvent, useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

type ProfileForm = {
  firstName: string;
  lastName: string;
  role: string;
  location: string;
  bio: string;
  yearsOfExperience: string;
  creativePhilosophy: string;
  skills: string;
  specializations: string;
  primaryRoles: string;
};

const toCsv = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string").join(", ") : "";

export default function ProfileEditModal({
  isOpen,
  onClose,
  profile,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  onSave: (data: Record<string, unknown>) => Promise<unknown>;
}) {
  const [form, setForm] = useState<ProfileForm>({ firstName: "", lastName: "", role: "", location: "", bio: "", yearsOfExperience: "", creativePhilosophy: "", skills: "", specializations: "", primaryRoles: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setForm({
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      role: profile?.role || "",
      location: profile?.location || "",
      bio: profile?.bio || "",
      yearsOfExperience: profile?.yearsOfExperience?.toString() || "",
      creativePhilosophy: profile?.creativePhilosophy || "",
      skills: toCsv(profile?.skills),
      specializations: toCsv(profile?.specializations),
      primaryRoles: toCsv(profile?.primaryRoles),
    });
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const setField = (field: keyof ProfileForm, value: string) => setForm((current) => ({ ...current, [field]: value }));
  const asList = (value: string) => value.split(",").map((item) => item.trim()).filter(Boolean);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        ...form,
        yearsOfExperience: form.yearsOfExperience ? Number(form.yearsOfExperience) : null,
        skills: asList(form.skills),
        specializations: asList(form.specializations),
        primaryRoles: asList(form.primaryRoles),
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const fields: { key: keyof ProfileForm; label: string; type?: "text" | "number" }[] = [
    { key: "firstName", label: "First name" }, { key: "lastName", label: "Last name" },
    { key: "role", label: "Primary role" }, { key: "location", label: "Location" },
    { key: "yearsOfExperience", label: "Years of experience", type: "number" },
    { key: "creativePhilosophy", label: "Creative philosophy" }, { key: "skills", label: "Skills (comma separated)" },
    { key: "specializations", label: "Specializations (comma separated)" }, { key: "primaryRoles", label: "Roles (comma separated)" },
  ];

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="edit-profile-title">
      <form onSubmit={handleSubmit} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#18202e] p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div><h2 id="edit-profile-title" className="text-xl font-bold text-white">Edit profile</h2><p className="mt-1 text-sm text-white/50">Update what collaborators see on your profile.</p></div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white"><FiX size={20} /></button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.slice(0, 2).map(({ key, label, type }) => <label key={key} className="text-sm text-white/70">{label}<input type={type || "text"} value={form[key]} onChange={(event) => setField(key, event.target.value)} className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none focus:border-primary-green" /></label>)}
        </div>
        <label className="mt-4 block text-sm text-white/70">About<textarea value={form.bio} onChange={(event) => setField("bio", event.target.value)} rows={4} className="mt-1.5 w-full resize-y rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none focus:border-primary-green" /></label>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.slice(2).map(({ key, label, type }) => <label key={key} className="text-sm text-white/70">{label}<input type={type || "text"} value={form[key]} onChange={(event) => setField(key, event.target.value)} className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none focus:border-primary-green" /></label>)}
        </div>
        <div className="mt-7 flex justify-end gap-3"><button type="button" onClick={onClose} disabled={isSaving} className="rounded-full px-4 py-2 text-sm font-semibold text-white/60 hover:bg-white/10">Cancel</button><button type="submit" disabled={isSaving} className="rounded-full bg-primary-green px-5 py-2 text-sm font-semibold text-white disabled:opacity-60">{isSaving ? "Saving…" : "Save changes"}</button></div>
      </form>
    </div>
  );
}
