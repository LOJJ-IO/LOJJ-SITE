"use client";

import { useMemo, useState } from "react";

import type { DemoTopic } from "@/lib/solutions";

type ManagerSplitDemoProps = {
  topics: DemoTopic[];
};

const SIDEBAR = [
  {
    label: "Property",
    items: [{ icon: "🏨", title: "Riverside Hotel overview" }],
  },
  {
    label: "Guest policies",
    items: [
      { icon: "🕐", title: "Check-in & check-out" },
      { icon: "📶", title: "Wi‑Fi & in-room tech" },
      { icon: "🅿️", title: "Parking & luggage" },
    ],
  },
  {
    label: "Operations",
    items: [
      { icon: "🛏️", title: "Housekeeping standards" },
      { icon: "🔧", title: "Maintenance escalation" },
      { icon: "☕", title: "Breakfast & amenities" },
    ],
  },
  {
    label: "Staff & billing",
    items: [
      { icon: "🧾", title: "Invoices & folios" },
      { icon: "⭐", title: "Upgrades & comps" },
      { icon: "🚨", title: "Safety & emergencies" },
    ],
  },
] as const;

const DOC_CARDS = [
  {
    icon: "🕐",
    title: "Check-in & check-out",
    body: "Hours, early arrival bag holds, late checkout rules, and ID requirements for front desk.",
  },
  {
    icon: "📶",
    title: "Wi‑Fi & amenities",
    body: "Network credentials, pool and gym hours, breakfast service, and in-room appliance guides.",
  },
  {
    icon: "🛏️",
    title: "Housekeeping",
    body: "Turndown times, extra linens, minibar restocks, and how to log requests in Ops Lead.",
  },
  {
    icon: "🔧",
    title: "Maintenance & room issues",
    body: "AC and plumbing triage, noise complaints, room moves, and when to escalate to duty manager.",
  },
  {
    icon: "🧾",
    title: "Billing & invoices",
    body: "Folio breakdowns, tax receipts, corporate billing, and the invoice correction workflow.",
  },
  {
    icon: "📋",
    title: "Guest policies",
    body: "Pets, smoking, deposits, local recommendations, and what Guest Expert can answer automatically.",
  },
] as const;

export default function ManagerSplitDemo({ topics }: ManagerSplitDemoProps) {
  const [activeId, setActiveId] = useState(topics[0]?.id ?? "");
  const active = useMemo(() => topics.find((t) => t.id === activeId) ?? topics[0], [topics, activeId]);

  return (
    <div className="demo-manager-split" role="presentation">
      <div className="demo-helpdesk-workspace" aria-label="Hotel documentation">
        <div className="demo-helpdesk-app">
          <header className="demo-helpdesk-topbar">
            <div className="demo-helpdesk-brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/lojj-review-hub.png" alt="" className="demo-helpdesk-brand-mark" />
              <span className="demo-helpdesk-brand-name">LOJJ</span>
            </div>
            <span className="demo-helpdesk-property-pill">Riverside Hotel · Staff docs</span>
          </header>

          <div className="demo-helpdesk-layout">
            <nav className="demo-helpdesk-sidebar" aria-label="Documentation sections">
              {SIDEBAR.map((group) => (
                <div key={group.label} className="demo-helpdesk-sidebar-group">
                  <p className="demo-helpdesk-sidebar-label">{group.label}</p>
                  <ul className="demo-helpdesk-sidebar-list">
                    {group.items.map((item) => (
                      <li key={item.title}>
                        <span className="demo-helpdesk-sidebar-item">
                          <span className="demo-helpdesk-sidebar-icon" aria-hidden>
                            {item.icon}
                          </span>
                          <span className="demo-helpdesk-sidebar-text">{item.title}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>

            <main className="demo-helpdesk-main">
              <div className="demo-helpdesk-hero">
                <h3 className="demo-helpdesk-hero-title">Hotel documentation</h3>
                <p className="demo-helpdesk-hero-sub">
                  LOJJ helps you publish policies and procedures your team actually uses — the same
                  articles train the AI, appear on your help page, and power answers in the assistant
                  panel.
                </p>
              </div>

              <div className="demo-helpdesk-search" role="search">
                <span className="demo-helpdesk-search-icon" aria-hidden>
                  ✦
                </span>
                <span className="demo-helpdesk-search-placeholder">
                  Search hotel docs or ask the assistant…
                </span>
                <span className="demo-helpdesk-search-go" aria-hidden>
                  →
                </span>
              </div>

              <div className="demo-helpdesk-cards">
                {DOC_CARDS.map((card) => (
                  <article key={card.title} className="demo-helpdesk-card">
                    <span className="demo-helpdesk-card-icon" aria-hidden>
                      {card.icon}
                    </span>
                    <h4 className="demo-helpdesk-card-title">{card.title}</h4>
                    <p className="demo-helpdesk-card-body">{card.body}</p>
                  </article>
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>

      <aside className="demo-manager-assistant" aria-label="LOJJ assistant panel">
        <header className="demo-manager-ai-head">
          <span className="demo-manager-ai-title">LOJJ</span>
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
              <p className="demo-manager-ai-role">From your docs</p>
              <p className="demo-manager-ai-question">
                <strong>{active.title}</strong>
              </p>
              <p className="demo-manager-ai-answer">{active.answer}</p>
            </div>
          ) : (
            <p className="demo-manager-ai-placeholder">
              Pick a question below — answers come from your hotel documentation.
            </p>
          )}
        </div>

        <div className="demo-manager-ai-prompts">
          <p className="demo-manager-ai-prompts-label">Ask the assistant</p>
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
            <span className="demo-manager-ai-meta">Hotel docs</span>
          </div>
          <div className="demo-manager-ai-input">Ask about your documentation…</div>
        </div>
      </aside>
    </div>
  );
}
