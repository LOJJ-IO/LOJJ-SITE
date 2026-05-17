"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  DEMO_OPS_BASE_QUEUE,
  useDemoSimulation,
} from "@/components/solutions/DemoSimulationContext";
import type { DemoQueueItem, OpsTaskStatus } from "@/lib/solutions";

const COLUMNS: { id: OpsTaskStatus; label: string; tone: string }[] = [
  { id: "todo", label: "To-Do", tone: "ops-kanban-col--todo" },
  { id: "assigned", label: "Assigned", tone: "ops-kanban-col--assigned" },
  { id: "doing", label: "Doing", tone: "ops-kanban-col--doing" },
  { id: "done", label: "Done", tone: "ops-kanban-col--done" },
];

const priorityClass: Record<DemoQueueItem["priority"], string> = {
  high: "ops-kanban-priority-high",
  medium: "ops-kanban-priority-medium",
  low: "ops-kanban-priority-low",
};

function groupByStatus(items: DemoQueueItem[]): Record<OpsTaskStatus, DemoQueueItem[]> {
  const grouped: Record<OpsTaskStatus, DemoQueueItem[]> = {
    todo: [],
    assigned: [],
    doing: [],
    done: [],
  };
  for (const item of items) {
    grouped[item.status].push(item);
  }
  return grouped;
}

export default function OpsLeadKanbanDemo() {
  const { opsExtraQueue } = useDemoSimulation();
  const items = useMemo(
    () => [...opsExtraQueue, ...DEMO_OPS_BASE_QUEUE],
    [opsExtraQueue],
  );
  const byColumn = useMemo(() => groupByStatus(items), [items]);
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const active = useMemo(
    () => items.find((item) => item.id === activeId) ?? items[0],
    [items, activeId],
  );

  useEffect(() => {
    if (items.length && !items.some((r) => r.id === activeId)) {
      setActiveId(items[0].id);
    }
  }, [items, activeId]);

  const hadSyncedRef = useRef(false);
  useEffect(() => {
    const hasSynced = opsExtraQueue.some((i) => i.id === "demo-late-checkout");
    if (hasSynced && !hadSyncedRef.current) {
      setActiveId("demo-late-checkout");
      hadSyncedRef.current = true;
    }
    if (!hasSynced) hadSyncedRef.current = false;
  }, [opsExtraQueue]);

  return (
    <div className="ops-kanban">
      <div className="ops-kanban-toolbar">
        <h4 className="ops-kanban-toolbar-title">Your tasks</h4>
        <div className="ops-kanban-toolbar-actions" aria-hidden>
          <span className="ops-kanban-btn ops-kanban-btn--primary">Add a task</span>
          <span className="ops-kanban-btn ops-kanban-btn--ghost">Invite</span>
        </div>
      </div>

      <div className="ops-kanban-board" role="region" aria-label="Task board columns">
        {COLUMNS.map((col) => (
          <section
            key={col.id}
            className={`ops-kanban-col ${col.tone}`}
            aria-label={`${col.label} column`}
          >
            <header className="ops-kanban-col-head">
              <span className="ops-kanban-col-label">{col.label}</span>
              <span className="ops-kanban-col-count">{byColumn[col.id].length}</span>
            </header>
            <div className="ops-kanban-col-cards">
              {byColumn[col.id].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`ops-kanban-card${
                    item.id === active?.id ? " ops-kanban-card--active" : ""
                  }${item.id === "demo-late-checkout" ? " ops-kanban-card--synced" : ""}${
                    item.status === "done" ? " ops-kanban-card--done" : ""
                  }`}
                  onClick={() => setActiveId(item.id)}
                  aria-pressed={item.id === active?.id}
                >
                  <div className="ops-kanban-card-top">
                    <span className={`ops-kanban-priority ${priorityClass[item.priority]}`}>
                      {item.priority}
                    </span>
                    <span className="ops-kanban-card-eta">{item.eta}</span>
                  </div>
                  <p className="ops-kanban-card-title">{item.title}</p>
                  {item.note ? <p className="ops-kanban-card-note">{item.note}</p> : null}
                  <p className="ops-kanban-card-meta">{item.location}</p>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      {active ? (
        <p className="ops-kanban-detail" aria-live="polite">
          <strong>{active.title}</strong> — routing to {active.location} ({active.priority} priority).
          {active.id === "demo-late-checkout"
            ? " Synced from Guest Expert."
            : ` Team ETA: ${active.eta}.`}
        </p>
      ) : null}
    </div>
  );
}
