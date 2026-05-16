"use client";

import { useMemo, useState } from "react";

import type { DemoTopic } from "@/lib/solutions";

type ManagerSplitDemoProps = {
  topics: DemoTopic[];
};

const CAL_EVENTS = [
  { start: "08:00", label: "Shift handover", detail: "15 min · Front desk" },
  { start: "09:30", label: "VIP arrival · Room 412", detail: "45 min · Lobby" },
  { start: "11:00", label: "Housekeeping stand-up", detail: "20 min · Back office" },
  { start: "13:00", label: "Group check-in · Bus A", detail: "60 min · Arrivals desk" },
  { start: "15:30", label: "Maintenance window · 3rd floor", detail: "45 min · Engineering" },
] as const;

export default function ManagerSplitDemo({ topics }: ManagerSplitDemoProps) {
  const [activeId, setActiveId] = useState(topics[0]?.id ?? "");
  const active = useMemo(() => topics.find((t) => t.id === activeId) ?? topics[0], [topics, activeId]);

  return (
    <div className="demo-manager-split" role="presentation">
      <section className="demo-manager-workspace" aria-label="Front desk workspace">
        <header className="demo-manager-ws-top">
          <div className="demo-manager-ws-titles">
            <span className="demo-manager-ws-kicker">Today</span>
            <h3 className="demo-manager-ws-heading">Front desk</h3>
            <p className="demo-manager-ws-meta">Riverside Hotel · Lobby calendar</p>
          </div>
          <div className="demo-manager-ws-actions">
            <span className="demo-manager-ws-pill">Live ops sync on</span>
          </div>
        </header>

        <div className="demo-manager-cal">
          <div className="demo-manager-cal-toolbar">
            <span className="demo-manager-cal-date">Wednesday · May 14</span>
            <div className="demo-manager-cal-nav" aria-hidden>
              <span className="demo-manager-cal-nav-btn">‹</span>
              <span className="demo-manager-cal-nav-btn">›</span>
            </div>
          </div>
          <ol className="demo-manager-cal-agenda">
            {CAL_EVENTS.map((ev) => (
              <li key={`${ev.start}-${ev.label}`} className="demo-manager-cal-row">
                <span className="demo-manager-cal-time">{ev.start}</span>
                <div className="demo-manager-cal-block">
                  <span className="demo-manager-cal-block-title">{ev.label}</span>
                  <span className="demo-manager-cal-block-sub">{ev.detail}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <aside className="demo-manager-assistant" aria-label="AI assistant">
        <header className="demo-manager-ai-head">
          <span className="demo-manager-ai-title">AI Manager</span>
          <div className="demo-manager-ai-tools" aria-hidden>
            <span className="demo-manager-ai-tool">＋</span>
            <span className="demo-manager-ai-tool">▭</span>
            <span className="demo-manager-ai-tool">⚙</span>
            <span className="demo-manager-ai-tool demo-manager-ai-tool--muted">×</span>
          </div>
        </header>

        <div className="demo-manager-ai-thread" aria-live="polite">
          {active ? (
            <div className="demo-manager-ai-bubble">
              <p className="demo-manager-ai-role">Assistant</p>
              <p className="demo-manager-ai-question">
                <strong>{active.title}</strong>
              </p>
              <p className="demo-manager-ai-answer">{active.answer}</p>
            </div>
          ) : (
            <p className="demo-manager-ai-placeholder">Select a question below to load guidance.</p>
          )}
        </div>

        <div className="demo-manager-ai-prompts">
          <p className="demo-manager-ai-prompts-label">Quick questions</p>
          <ul className="demo-manager-ai-topic-list" role="list">
            {topics.map((topic) => (
              <li key={topic.id}>
                <button
                  type="button"
                  className={`demo-manager-ai-topic${topic.id === activeId ? " demo-manager-ai-topic--active" : ""}`}
                  onClick={() => setActiveId(topic.id)}
                >
                  {topic.title}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="demo-manager-ai-compose" aria-hidden>
          <div className="demo-manager-ai-compose-row">
            <span className="demo-manager-ai-ctx">Context</span>
            <span className="demo-manager-ai-meta">Shift guidance</span>
          </div>
          <div className="demo-manager-ai-input">Message AI Manager…</div>
        </div>
      </aside>
    </div>
  );
}
