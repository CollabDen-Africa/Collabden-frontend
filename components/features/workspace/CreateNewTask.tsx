"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiX } from "react-icons/fi";
import DatePicker from "@/components/ui/DatePicker";
import { createTaskSchema, CreateTaskInput } from "@/lib/validations/task.schema";

interface CreateTaskModalProps {
  isOpen: boolean;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (task: { title: string; description?: string; dueDate?: string }) => Promise<void>;
}

export default function CreateTaskModal({ isOpen, isSubmitting = false, onClose, onSubmit }: CreateTaskModalProps) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: { title: "", description: "", selectedDate: undefined },
  });
  const selectedDate = watch("selectedDate");

  if (!isOpen) return null;

  const close = () => {
    if (isSubmitting) return;
    reset();
    onClose();
  };

  const submit = async (data: CreateTaskInput) => {
    await onSubmit({ title: data.title.trim(), description: data.description?.trim() || undefined, dueDate: data.selectedDate?.toISOString() });
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button aria-label="Close" className="absolute inset-0 bg-[#121A1F]/90 backdrop-blur-sm" onClick={close} />
      <div className="relative z-10 w-full max-w-[700px] rounded-[32px] border border-white/20 bg-[#1A2329] p-8 shadow-2xl">
        <button type="button" onClick={close} disabled={isSubmitting} className="absolute right-6 top-6 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 disabled:opacity-50" aria-label="Close task form"><FiX size={20} /></button>
        <h2 className="mb-8 text-center font-sans text-2xl font-bold text-white">Create New Task</h2>
        <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-6">
          <label className="flex flex-col gap-2 font-sans text-sm font-semibold text-white">Task name<input {...register("title")} disabled={isSubmitting} placeholder="Enter task name" className="h-12 rounded-full border border-white/20 bg-white/5 px-5 text-base font-medium text-white outline-none placeholder:text-white/30 focus:border-primary-green disabled:opacity-50" />{errors.title && <span className="text-xs font-medium text-red-400">{errors.title.message}</span>}</label>
          <label className="flex flex-col gap-2 font-sans text-sm font-semibold text-white">Description <span className="font-normal text-white/60">(optional)</span><textarea {...register("description")} disabled={isSubmitting} placeholder="Describe this task" className="h-32 resize-none rounded-2xl border border-white/20 bg-white/5 p-4 text-base font-medium text-white outline-none placeholder:text-white/30 focus:border-primary-green disabled:opacity-50" />{errors.description && <span className="text-xs font-medium text-red-400">{errors.description.message}</span>}</label>
          <div className="flex flex-col gap-2 font-sans text-sm font-semibold text-white"><span>Due date <span className="font-normal text-white/60">(optional)</span></span><DatePicker selectedDate={selectedDate} onSelect={(date) => setValue("selectedDate", date, { shouldValidate: true })} className="rounded-full border border-white/20 bg-white/5 px-5" /></div>
          <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={close} disabled={isSubmitting} className="rounded-full bg-white/10 px-6 py-2.5 text-sm font-medium text-white hover:bg-white/20 disabled:opacity-50">Cancel</button><button type="submit" disabled={isSubmitting} className="rounded-full bg-primary-green px-6 py-2.5 text-sm font-bold text-white hover:brightness-110 disabled:opacity-50">{isSubmitting ? "Creating…" : "Create Task"}</button></div>
        </form>
      </div>
    </div>
  );
}
