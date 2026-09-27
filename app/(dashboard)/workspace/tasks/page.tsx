"use client";

import { type DragEvent, useEffect, useState } from "react";
import { HiCheck } from "react-icons/hi";
import { FiCalendar, FiPlus } from "react-icons/fi";
import CreateTaskModal from "@/components/features/workspace/CreateNewTask";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useProjects } from "@/hooks/projects/useProjects";
import type { CreateProjectTaskPayload, ProjectTask, ProjectTaskStatus } from "@/types/api.types";

const COLUMNS: Array<{ id: ProjectTaskStatus; title: string; subtitle: string; indicatorColor: string }> = [
  { id: "TODO", title: "To Do", subtitle: "Not started", indicatorColor: "bg-primary-blue" },
  { id: "IN_PROGRESS", title: "In Progress", subtitle: "Currently being worked on", indicatorColor: "bg-accent-yellow" },
  { id: "COMPLETED", title: "Completed", subtitle: "Finished tasks", indicatorColor: "bg-primary-green" },
];

function formatDueDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function TasksPage() {
  const { projectDetails, isLoading } = useWorkspace();
  const projectId = projectDetails?.id || "";
  const { useCreateProjectTask, useUpdateProjectTaskStatus } = useProjects();
  const createTask = useCreateProjectTask(projectId);
  const updateTaskStatus = useUpdateProjectTaskStatus(projectId);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<ProjectTaskStatus | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const tasks = projectDetails?.tasks || [];

  useEffect(() => {
    if (!successMessage) return;
    const timeout = window.setTimeout(() => setSuccessMessage(null), 4_000);
    return () => window.clearTimeout(timeout);
  }, [successMessage]);

  const submitTask = async (data: Omit<CreateProjectTaskPayload, "status">) => {
    await createTask.mutateAsync({ ...data, status: "TODO" });
    setSuccessMessage("Task created successfully.");
  };

  const moveTask = (event: DragEvent<HTMLElement>, status: ProjectTaskStatus) => {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("text/project-task") || draggedTaskId;
    const task = tasks.find((item) => item.id === taskId);
    setDraggedTaskId(null);
    setDropTarget(null);
    if (!taskId || !task || task.status === status || updateTaskStatus.isPending) return;
    void updateTaskStatus.mutateAsync({ taskId, status })
      .then(() => setSuccessMessage(`Task moved to ${status === "IN_PROGRESS" ? "In Progress" : status === "COMPLETED" ? "Completed" : "To Do"}.`))
      .catch(() => undefined);
  };

  if (isLoading) return <div className="p-6 text-sm text-white/70">Loading tasks…</div>;
  if (!projectDetails) return <div className="p-6 text-sm text-white/70">Select a project to view its tasks.</div>;

  return (
    <div className="flex h-full w-full flex-col pb-4">
      <div className="mb-6 flex items-center justify-between px-2"><div><h1 className="font-sans text-xl font-bold text-white">Tasks</h1><p className="mt-1 text-sm text-white/60">{projectDetails.name}</p></div><button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 rounded-full bg-primary-green px-4 py-2 text-sm font-bold text-white hover:brightness-110"><FiPlus size={16} /> Create task</button></div>
      <div className="custom-scrollbar flex flex-1 items-start gap-6 overflow-x-auto pb-6">
        {COLUMNS.map((column) => {
          const columnTasks = tasks.filter((task) => task.status === column.id);
          return <section key={column.id} onDragOver={(event) => { event.preventDefault(); setDropTarget(column.id); }} onDragLeave={() => setDropTarget((current) => current === column.id ? null : current)} onDrop={(event) => moveTask(event, column.id)} className={`flex max-h-full w-[337px] shrink-0 flex-col rounded-[20px] border bg-black/20 transition-colors ${dropTarget === column.id ? "border-primary-green bg-primary-green/10" : "border-white/5"}`}><div className="flex shrink-0 items-center justify-between border-b border-white/20 p-[14px_19px]"><div className="flex items-center gap-3"><span className={`h-[10px] w-[10px] rounded-full ${column.indicatorColor}`} /><div><h2 className="text-sm font-bold text-white">{column.title}</h2><p className="mt-1 text-xs text-white/70">{column.subtitle}</p></div></div><span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[10px] text-white">{columnTasks.length}</span></div><div className="custom-scrollbar flex min-h-[150px] flex-1 flex-col gap-4 overflow-y-auto p-[14px]">{columnTasks.length === 0 ? <div className="flex h-[120px] items-center justify-center rounded-[20px] border border-dashed border-white/30 bg-black/10 px-4 text-center text-xs text-white/50">Drop a task here</div> : columnTasks.map((task: ProjectTask) => <TaskCard key={task.id} task={task} onDragStart={(event) => { event.dataTransfer.setData("text/project-task", task.id); event.dataTransfer.effectAllowed = "move"; setDraggedTaskId(task.id); }} onDragEnd={() => { setDraggedTaskId(null); setDropTarget(null); }} />)}</div>{column.id === "TODO" && <button onClick={() => setIsCreateModalOpen(true)} className="m-[14px] flex items-center justify-center gap-2 rounded-lg p-[10px] text-xs font-medium text-white/60 hover:bg-white/5"><FiPlus size={14} /> Add task</button>}</section>;
        })}
      </div>
      <CreateTaskModal isOpen={isCreateModalOpen} isSubmitting={createTask.isPending} onClose={() => setIsCreateModalOpen(false)} onSubmit={submitTask} />
      {successMessage && <div role="status" className="fixed right-5 top-5 z-[100] flex items-center gap-3 rounded-2xl border border-primary-green/40 bg-[#15251e] px-4 py-3 text-sm text-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-green text-[#15251e]"><HiCheck size={16} /></span><span>{successMessage}</span></div>}
    </div>
  );
}

function TaskCard({ task, onDragStart, onDragEnd }: { task: ProjectTask; onDragStart: (event: DragEvent<HTMLElement>) => void; onDragEnd: () => void }) {
  const dueDate = formatDueDate(task.dueDate);
  return <article draggable onDragStart={onDragStart} onDragEnd={onDragEnd} className="flex cursor-grab flex-col gap-3 rounded-[20px] border border-white/30 bg-black/20 p-4 shadow-[0_4px_4px_rgba(0,0,0,0.25)] active:cursor-grabbing"><h3 className="text-base font-bold text-white">{task.title}</h3>{task.description && <p className="text-xs leading-relaxed text-white/70">{task.description}</p>}{dueDate && <div className="flex items-center gap-2 text-xs text-white/70"><FiCalendar size={13} /> Due {dueDate}</div>}</article>;
}
