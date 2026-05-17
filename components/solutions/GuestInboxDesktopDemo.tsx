"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  useDemoSimulation,
  type DemoChatMessage,
} from "@/components/solutions/DemoSimulationContext";

type InboxThread = {
  id: string;
  name: string;
  preview: string;
  time: string;
  initials: string;
  group?: string;
  staticMessages?: DemoChatMessage[];
};

const STATIC_THREADS: InboxThread[] = [
  {
    id: "daniel",
    name: "Daniel K.",
    preview: "Garage B works — thank you!",
    time: "Yesterday",
    initials: "DK",
    group: "Yesterday",
    staticMessages: [
      {
        id: "d1",
        role: "user",
        body: "Where should I park overnight?",
        time: "6:14 PM",
      },
      {
        id: "d2",
        role: "assistant",
        body: "Overnight parking is in Garage B, levels 2 to 4. Show your room key at entry for guest validation.",
        time: "6:14 PM",
      },
      {
        id: "d3",
        role: "user",
        body: "Garage B works — thank you!",
        time: "6:15 PM",
      },
    ],
  },
  {
    id: "amina",
    name: "Amina T.",
    preview: "Late checkout confirmed for 1 PM",
    time: "Mon",
    initials: "AT",
    group: "This week",
    staticMessages: [
      {
        id: "a1",
        role: "user",
        body: "Can I get a late checkout?",
        time: "10:02 AM",
      },
      {
        id: "a2",
        role: "assistant",
        body: "You can request 1:00 PM checkout based on availability. I've created a front-desk follow-up so the team can confirm shortly.",
        time: "10:03 AM",
      },
      {
        id: "a3",
        role: "staff",
        body: "Front desk confirmed 1:00 PM checkout for you — see you then!",
        time: "10:18 AM",
      },
    ],
  },
  {
    id: "james",
    name: "James L.",
    preview: "Pool hours?",
    time: "Sun",
    initials: "JL",
    group: "This week",
    staticMessages: [
      {
        id: "j1",
        role: "user",
        body: "What time does the pool close?",
        time: "4:40 PM",
      },
      {
        id: "j2",
        role: "assistant",
        body: "The pool is open 7 AM – 10 PM daily. Towels are at the cabana desk.",
        time: "4:40 PM",
      },
    ],
  },
];

const SIDEBAR_WIDTH_DEFAULT = 260;
const SIDEBAR_WIDTH_MIN = 180;
const SIDEBAR_WIDTH_MAX_RATIO = 0.58;

const PREVIEW_STEPS: Pick<DemoChatMessage, "role" | "body">[] = [
  { role: "user", body: "Hello" },
  {
    role: "assistant",
    body: "Hello! I'm LOJJ, your hotel assistant. Ask about Wi-Fi, checkout, parking, or anything about your stay.",
  },
];

function roleLabel(role: DemoChatMessage["role"]) {
  if (role === "user") return "Guest";
  if (role === "staff") return "Staff";
  return "LOJJ";
}

function ChatBubbles({ messages }: { messages: DemoChatMessage[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  return (
    <div ref={scrollRef} className="guest-inbox-chat-scroll" aria-live="polite">
      {messages.map((m) => {
        const isUser = m.role === "user";
        const isStaff = m.role === "staff";
        return (
          <div
            key={m.id}
            className={`guest-inbox-msg guest-inbox-msg--${isUser ? "user" : isStaff ? "staff" : "assistant"}`}
          >
            <span className="guest-inbox-msg-role">{roleLabel(m.role)}</span>
            <div
              className={`guest-inbox-bubble guest-inbox-bubble--${
                isUser ? "user" : isStaff ? "staff" : "assistant"
              }`}
            >
              <p>{m.body}</p>
            </div>
            <span className="guest-inbox-msg-time">{m.time}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function GuestInboxDesktopDemo() {
  const { guestMessages } = useDemoSimulation();
  const splitRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string>("live");
  const [previewCount, setPreviewCount] = useState(0);
  const [sidebarWidthPx, setSidebarWidthPx] = useState<number | null>(null);

  const liveMessages = guestMessages;
  const usingLive = liveMessages.length > 0;

  useEffect(() => {
    if (usingLive) {
      setPreviewCount(0);
      return;
    }
    setPreviewCount(0);
    const timers: number[] = [];
    PREVIEW_STEPS.forEach((_, i) => {
      timers.push(
        window.setTimeout(() => {
          setPreviewCount(i + 1);
        }, 900 + i * 1100),
      );
    });
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [usingLive]);

  const previewMessages: DemoChatMessage[] = useMemo(
    () =>
      PREVIEW_STEPS.slice(0, previewCount).map((step, i) => ({
        id: `preview-${i}`,
        role: step.role,
        body: step.body,
        time: "Now",
      })),
    [previewCount],
  );

  const displayLive = usingLive ? liveMessages : previewMessages;

  const livePreview =
    displayLive.length > 0
      ? displayLive[displayLive.length - 1]?.body.slice(0, 56) +
        (displayLive[displayLive.length - 1]!.body.length > 56 ? "…" : "")
      : "Tap Hello on the phone to start";

  const selectedStatic = STATIC_THREADS.find((t) => t.id === selectedId);
  const chatMessages =
    selectedId === "live" ? displayLive : (selectedStatic?.staticMessages ?? []);

  const onSplitterPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const split = splitRef.current;
    if (!split) return;

    const sidebar = split.querySelector<HTMLElement>(".guest-inbox-sidebar");
    const startX = e.clientX;
    const startW = sidebarWidthPx ?? sidebar?.getBoundingClientRect().width ?? SIDEBAR_WIDTH_DEFAULT;

    const onMove = (ev: PointerEvent) => {
      const maxW = split.getBoundingClientRect().width * SIDEBAR_WIDTH_MAX_RATIO;
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
      ? ({ "--guest-inbox-sidebar-w": `${Math.round(sidebarWidthPx)}px` } as React.CSSProperties)
      : undefined;

  return (
    <div ref={splitRef} className="guest-inbox-split" style={splitStyle}>
      <aside className="guest-inbox-sidebar" aria-label="Guest conversations">
        <header className="guest-inbox-sidebar-head">
          <h4 className="guest-inbox-sidebar-title">Inbox</h4>
          <span className="guest-inbox-sidebar-meta">Riverside Hotel</span>
        </header>
        <div className="guest-inbox-thread-list" role="listbox" aria-label="Threads">
          <p className="guest-inbox-group-label">Today</p>
          <button
            type="button"
            role="option"
            aria-selected={selectedId === "live"}
            className={`guest-inbox-thread${selectedId === "live" ? " guest-inbox-thread--active" : ""}${
              usingLive ? " guest-inbox-thread--synced" : ""
            }`}
            onClick={() => setSelectedId("live")}
          >
            <span className="guest-inbox-thread-avatar guest-inbox-thread-avatar--live">You</span>
            <span className="guest-inbox-thread-body">
              <span className="guest-inbox-thread-top">
                <span className="guest-inbox-thread-name">Room 412 · Live</span>
                <span className="guest-inbox-thread-time">{usingLive ? "Now" : "Live"}</span>
              </span>
              <span className="guest-inbox-thread-preview">{livePreview}</span>
            </span>
          </button>

          {["Yesterday", "This week"].map((group) => {
            const rows = STATIC_THREADS.filter((t) => t.group === group);
            if (!rows.length) return null;
            return (
              <div key={group}>
                <p className="guest-inbox-group-label">{group}</p>
                {rows.map((thread) => (
                  <button
                    key={thread.id}
                    type="button"
                    role="option"
                    aria-selected={selectedId === thread.id}
                    className={`guest-inbox-thread${
                      selectedId === thread.id ? " guest-inbox-thread--active" : ""
                    }`}
                    onClick={() => setSelectedId(thread.id)}
                  >
                    <span className="guest-inbox-thread-avatar">{thread.initials}</span>
                    <span className="guest-inbox-thread-body">
                      <span className="guest-inbox-thread-top">
                        <span className="guest-inbox-thread-name">{thread.name}</span>
                        <span className="guest-inbox-thread-time">{thread.time}</span>
                      </span>
                      <span className="guest-inbox-thread-preview">{thread.preview}</span>
                    </span>
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </aside>

      <div
        className="guest-inbox-splitter"
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize inbox and conversation columns"
        tabIndex={0}
        onPointerDown={onSplitterPointerDown}
        onDoubleClick={() => setSidebarWidthPx(null)}
        title="Drag to resize columns. Double-click to reset."
      />

      <section className="guest-inbox-main" aria-label="Conversation">
        <header className="guest-inbox-main-head">
          <div>
            <h4 className="guest-inbox-main-title">
              {selectedId === "live" ? "Room 412 · Live session" : selectedStatic?.name}
            </h4>
            <p className="guest-inbox-main-sub">
              {selectedId === "live"
                ? usingLive
                  ? "Mirrors your phone conversation in real time"
                  : "Live chat — start with a reply on the phone"
                : "Archived guest thread"}
            </p>
          </div>
        </header>
        {chatMessages.length === 0 ? (
          <p className="guest-inbox-empty">Conversation will appear here…</p>
        ) : (
          <ChatBubbles messages={chatMessages} />
        )}
      </section>
    </div>
  );
}
