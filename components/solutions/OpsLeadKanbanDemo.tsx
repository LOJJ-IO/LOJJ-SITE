"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import DemoColumnSplitter from "@/components/solutions/DemoColumnSplitter";

import { Badge } from "@heroui/react";

import {
  IconBell,
  IconCalendar,
  IconCheckSquare,
  IconClipboard,
  IconLayoutGrid,
  IconLink,
  IconMessage,
  IconPaperclip,
  IconSearch,
  IconSparkles,
  IconStar,
  IconSettings,
} from "@/components/solutions/demo-icons";
import { useDemoSimulation } from "@/components/solutions/DemoSimulationContext";

type KanbanTag = { label: string; tone: "blue" | "orange" | "green" | "pink" };

type KanbanTask = {
  id: string;
  title: string;
  description: string;
  column: "todo" | "ongoing" | "done";
  tags?: KanbanTag[];
  urgent?: boolean;
  date?: string;
  comments?: number;
  attachments?: number;
  links?: number;
  checklist?: string;
  avatars?: number;
  synced?: boolean;
};

const BASE_TASKS: KanbanTask[] = [
  {
    id: "t1",
    title: "Room 704 — extra towels",
    description: "Deliver four bath towels before evening turndown",
    column: "todo",
    tags: [
      { label: "Housekeeping", tone: "blue" },
      { label: "Guest request", tone: "orange" },
    ],
    urgent: true,
    date: "Today",
    comments: 2,
    checklist: "0/2",
    avatars: 2,
  },
  {
    id: "t2",
    title: "Room 315 — AC not cooling",
    description: "Thermostat stuck at 74°F; maintenance filter check in progress",
    column: "todo",
    tags: [
      { label: "Maintenance", tone: "green" },
      { label: "Priority", tone: "pink" },
    ],
    urgent: true,
    date: "Today",
    attachments: 1,
    comments: 4,
    avatars: 1,
  },
  {
    id: "t3",
    title: "Lobby — luggage hold follow-up",
    description: "Guest returns at 4 PM — tags waiting at bell desk",
    column: "todo",
    tags: [
      { label: "Front Desk", tone: "pink" },
      { label: "Bell", tone: "blue" },
    ],
    date: "Today",
    links: 1,
    avatars: 1,
  },
  {
    id: "t4",
    title: "Room 218 — minibar restock",
    description: "Restock sparkling water and snacks before 6 PM arrival",
    column: "ongoing",
    tags: [{ label: "Housekeeping", tone: "blue" }],
    date: "Today",
    comments: 1,
    checklist: "1/3",
    avatars: 2,
  },
  {
    id: "t5",
    title: "Banquet — AV setup for wedding",
    description: "Projector, microphones, and seating layout for Riverside Ballroom",
    column: "ongoing",
    date: "Today",
    links: 3,
    avatars: 2,
  },
  {
    id: "t6",
    title: "Room 507 — crib delivery",
    description: "Housekeeping delivering crib to Priya Patel in Room 507",
    column: "ongoing",
    tags: [{ label: "Housekeeping", tone: "blue" }],
    date: "Today",
    checklist: "2/3",
    avatars: 1,
  },
  {
    id: "t7",
    title: "Room 119 — folio invoice copy",
    description: "Print corporate folio for Daniel Reeves at checkout",
    column: "ongoing",
    tags: [{ label: "Front Desk", tone: "pink" }],
    date: "Today",
    links: 1,
    avatars: 1,
  },
];

const COLUMNS = [
  { id: "todo" as const, label: "To-do" },
  { id: "ongoing" as const, label: "On-going" },
  { id: "done" as const, label: "Done" },
];

function SidebarIcon({ children }: { children: React.ReactNode }) {
  return <span className="acme-nav-icon">{children}</span>;
}

function TaskCard({ task }: { task: KanbanTask }) {
  return (
    <article
      className={`acme-task-card${task.synced ? " acme-task-card--synced" : ""}${task.urgent ? " acme-task-card--urgent" : ""}`}
    >
      <div className="acme-task-card-head">
        <h5 className="acme-task-card-title">{task.title}</h5>
        {task.urgent ? (
          <span className="acme-task-urgent" aria-label="Priority">
            !
          </span>
        ) : (
          <span className="acme-task-status-dot" aria-hidden />
        )}
      </div>
      <p className="acme-task-card-desc">{task.description}</p>
      {task.tags?.length ? (
        <div className="acme-task-tags">
          {task.tags.map((tag) => (
            <span key={tag.label} className={`acme-task-tag acme-task-tag--${tag.tone}`}>
              {tag.label}
            </span>
          ))}
        </div>
      ) : null}
      <footer className="acme-task-card-foot">
        {task.date ? <span className="acme-task-meta">{task.date}</span> : null}
        {task.comments != null ? (
          <span className="acme-task-meta acme-task-meta--icon" aria-hidden>
            <IconMessage size={12} />
          </span>
        ) : null}
        {task.attachments != null ? (
          <span className="acme-task-meta acme-task-meta--icon" aria-hidden>
            <IconPaperclip size={12} />
          </span>
        ) : null}
        {task.links != null ? (
          <span className="acme-task-meta acme-task-meta--icon" aria-hidden>
            <IconLink size={12} />
          </span>
        ) : null}
        {task.checklist ? (
          <span className="acme-task-meta acme-task-meta--icon" aria-hidden>
            <IconCheckSquare size={12} />
          </span>
        ) : null}
      </footer>
    </article>
  );
}

const SIDEBAR_WIDTH_DEFAULT = 200;
const SIDEBAR_WIDTH_MIN = 140;
const SIDEBAR_WIDTH_MAX_RATIO = 0.42;

export default function OpsLeadKanbanDemo() {
  const { opsExtraQueue } = useDemoSimulation();
  const hadSyncedRef = useRef(false);
  const splitRef = useRef<HTMLDivElement>(null);
  const [sidebarWidthPx, setSidebarWidthPx] = useState<number | null>(null);

  const syncedTask = useMemo<KanbanTask | null>(() => {
    const item = opsExtraQueue.find((i) => i.id === "demo-late-checkout");
    if (!item) return null;
    return {
      id: item.id,
      title: item.title,
      description: item.note ?? "Late checkout confirmed for Alex Johnson, Room 412.",
      column: "done",
      tags: [{ label: "Front Desk", tone: "green" }],
      date: "Now",
      avatars: 1,
      synced: true,
    };
  }, [opsExtraQueue]);

  const tasks = useMemo(() => {
    if (!syncedTask) return BASE_TASKS;
    return [...BASE_TASKS, syncedTask];
  }, [syncedTask]);

  const byColumn = useMemo(() => {
    const grouped: Record<(typeof COLUMNS)[number]["id"], KanbanTask[]> = {
      todo: [],
      ongoing: [],
      done: [],
    };
    for (const task of tasks) grouped[task.column].push(task);
    return grouped;
  }, [tasks]);

  useEffect(() => {
    const hasSynced = Boolean(syncedTask);
    if (hasSynced && !hadSyncedRef.current) hadSyncedRef.current = true;
    if (!hasSynced) hadSyncedRef.current = false;
  }, [syncedTask]);

  const onSidebarSplitterPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const root = splitRef.current;
    if (!root) return;
    const startX = e.clientX;
    const startW = sidebarWidthPx ?? SIDEBAR_WIDTH_DEFAULT;

    const onMove = (ev: PointerEvent) => {
      const maxW = root.getBoundingClientRect().width * SIDEBAR_WIDTH_MAX_RATIO;
      const next = Math.min(maxW, Math.max(SIDEBAR_WIDTH_MIN, startW + (ev.clientX - startX)));
      setSidebarWidthPx(next);
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const splitStyle =
    sidebarWidthPx != null
      ? ({ "--acme-sidebar-w": `${Math.round(sidebarWidthPx)}px` } as React.CSSProperties)
      : undefined;

  return (
    <div ref={splitRef} className="acme-app demo-ui-font demo-scroll-hidden" style={splitStyle}>
      <aside className="acme-sidebar demo-scroll-hidden" aria-label="Workspace navigation">
        <header className="acme-sidebar-head">
          <span className="acme-sidebar-logo" aria-hidden />
          <div className="acme-sidebar-brand">
            <span className="acme-sidebar-brand-name">Riverside Hotel</span>
            <span className="acme-sidebar-brand-user">Ops Lead</span>
          </div>
        </header>

        <div className="acme-sidebar-search">
          <span className="acme-sidebar-search-icon" aria-hidden>
            <IconSearch size={14} />
          </span>
          <span className="acme-sidebar-search-text">Search tasks or rooms</span>
          <span className="acme-sidebar-search-kbd">/</span>
        </div>

        <nav className="acme-sidebar-nav">
          <span className="acme-nav-item acme-nav-item--assistant">
            <SidebarIcon>
              <IconSparkles size={14} />
            </SidebarIcon>
            LOJJ Assistant
          </span>
          <span className="acme-nav-item">
            <SidebarIcon>
              <IconBell size={14} />
            </SidebarIcon>
            Notifications
            <Badge color="danger" size="sm" variant="soft">
              5
            </Badge>
          </span>
          <span className="acme-nav-item">
            <SidebarIcon>
              <IconLayoutGrid size={14} />
            </SidebarIcon>
            Dashboard
          </span>
          <span className="acme-nav-item">
            <SidebarIcon>
              <IconStar size={14} />
            </SidebarIcon>
            Assigned to me
          </span>
          <span className="acme-nav-item acme-nav-item--active">
            <SidebarIcon>
              <IconClipboard size={14} />
            </SidebarIcon>
            Tasks
          </span>
          <span className="acme-nav-item">
            <SidebarIcon>
              <IconClipboard size={14} />
            </SidebarIcon>
            Housekeeping
          </span>
          <span className="acme-nav-item">
            <SidebarIcon>
              <IconSettings size={14} />
            </SidebarIcon>
            Maintenance
          </span>
          <span className="acme-nav-item">
            <SidebarIcon>
              <IconCalendar size={14} />
            </SidebarIcon>
            Shift schedule
          </span>
        </nav>

        <div className="acme-sidebar-section">
          <p className="acme-sidebar-section-label">Departments</p>
          <span className="acme-nav-item acme-nav-item--sub">
            <SidebarIcon>
              <IconClipboard size={14} />
            </SidebarIcon>
            Housekeeping
          </span>
          <span className="acme-nav-item acme-nav-item--sub">
            <SidebarIcon>
              <IconSettings size={14} />
            </SidebarIcon>
            Engineering
          </span>
          <span className="acme-nav-item acme-nav-item--sub">
            <SidebarIcon>
              <IconBell size={14} />
            </SidebarIcon>
            Front Desk
          </span>
        </div>
      </aside>

      <DemoColumnSplitter
        label="Resize sidebar and task board"
        onPointerDown={onSidebarSplitterPointerDown}
        onDoubleClick={() => setSidebarWidthPx(null)}
      />

      <main className="acme-main">
        <header className="acme-main-head">
          <div className="acme-main-title-row">
            <span className="acme-main-star" aria-hidden>
              <IconSparkles size={14} />
            </span>
            <h4 className="acme-main-title">Riverside task board</h4>
          </div>
          <div className="acme-main-toolbar" aria-hidden>
            <button type="button" className="acme-toolbar-btn" tabIndex={-1}>
              Filter
            </button>
            <button type="button" className="acme-toolbar-btn" tabIndex={-1}>
              Sort
            </button>
            <button type="button" className="acme-toolbar-btn acme-toolbar-btn--pro" tabIndex={-1}>
              <IconSparkles size={12} />
              Automate
            </button>
          </div>
        </header>

        <div className="acme-kanban-board demo-scroll-hidden" role="region" aria-label="Task board">
          {COLUMNS.map((col) => (
            <section key={col.id} className="acme-kanban-col demo-scroll-hidden" aria-label={`${col.label} column`}>
              <header className="acme-kanban-col-head">
                <span className="acme-kanban-col-radio" aria-hidden />
                <h5 className="acme-kanban-col-title">{col.label}</h5>
                <span className="acme-kanban-col-actions" aria-hidden>
                  <span>+</span>
                  <span>⋯</span>
                </span>
              </header>

              <div className="acme-kanban-col-cards demo-scroll-hidden">
                {byColumn[col.id].map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
                {col.id === "done" && byColumn.done.length === 0 ? (
                  <div className="acme-kanban-empty">
                    <p className="acme-kanban-empty-title">No tasks completed yet</p>
                    <p className="acme-kanban-empty-sub">Completed guest requests will appear here</p>
                  </div>
                ) : null}
              </div>

              <button type="button" className="acme-kanban-add" aria-hidden>
                + Add task
              </button>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
