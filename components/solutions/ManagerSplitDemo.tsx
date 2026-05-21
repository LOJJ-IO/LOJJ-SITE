"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import DemoAvatar from "@/components/solutions/DemoAvatar";
import DemoColumnSplitter from "@/components/solutions/DemoColumnSplitter";
import {
  IconArrowUp,
  IconBell,
  IconBook,
  IconClipboard,
  IconCopy,
  IconPlus,
  IconSettings,
  IconSparkles,
  IconStar,
  IconX,
} from "@/components/solutions/demo-icons";
import { guestById } from "@/lib/demo-guests";

type WorkScreen = "chat" | "docs" | "ops";

type ChatLine = {
  id: string;
  role: "guest" | "staff";
  body: string;
};

const GUEST = guestById("sarah")!;

const CHAT_SCRIPT: ChatLine[] = [
  { id: "c1", role: "guest", body: "Hi front desk — can a guest in Room 412 get a late checkout?" },
  { id: "c2", role: "staff", body: "Let me check our late checkout policy for you." },
  { id: "c3", role: "staff", body: "Approved until 1:00 PM based on availability. I'll confirm with Alex Johnson now." },
];

const SOPS = [
  { title: "Late checkout policy", body: "Standard checkout 11 AM. One-hour extensions free; until 1 PM with manager approval." },
  { title: "Room move procedure", body: "Attempt fix once, then duty manager approves relocation and updates folio." },
  { title: "Housekeeping escalation", body: "Tag urgent requests in Ops Lead and notify floor supervisor within 10 minutes." },
  { title: "Garage & overnight parking", body: "Garage B levels 2–4. Validate with room key at entry gate." },
];

const OPS_GHOST_COLS = ["To-do", "On-going", "Done"];

const COWORKER_WIDTH_DEFAULT = 220;
const COWORKER_WIDTH_MIN = 160;
const COWORKER_WIDTH_MAX_RATIO = 0.48;

export default function ManagerSplitDemo() {
  const splitRef = useRef<HTMLDivElement>(null);
  const [screen, setScreen] = useState<WorkScreen>("chat");
  const [visibleCount, setVisibleCount] = useState(1);
  const [mosbyStep, setMosbyStep] = useState(0);
  const [coworkerWidthPx, setCoworkerWidthPx] = useState<number | null>(null);

  useEffect(() => {
    const cycle = window.setInterval(() => {
      setScreen((prev) => (prev === "chat" ? "docs" : prev === "docs" ? "ops" : "chat"));
      setVisibleCount(1);
      setMosbyStep(0);
    }, 9000);
    return () => window.clearInterval(cycle);
  }, []);

  useEffect(() => {
    if (screen !== "chat") return;
    if (visibleCount >= CHAT_SCRIPT.length) return;
    const t = window.setTimeout(() => setVisibleCount((c) => c + 1), 1400);
    return () => window.clearTimeout(t);
  }, [screen, visibleCount]);

  useEffect(() => {
    const t = window.setTimeout(() => setMosbyStep(1), 1200);
    const t2 = window.setTimeout(() => setMosbyStep(2), 2600);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(t2);
    };
  }, [screen]);

  const visibleMessages = useMemo(
    () => CHAT_SCRIPT.slice(0, screen === "chat" ? visibleCount : CHAT_SCRIPT.length),
    [screen, visibleCount],
  );

  const workTitle =
    screen === "chat" ? "Front desk chat" : screen === "docs" ? "Riverside SOPs" : "Ops Lead";

  const workPill =
    screen === "chat" ? "Guest message" : screen === "docs" ? "Hotel procedures" : "Task board";

  const onCoworkerSplitterPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const root = splitRef.current;
    if (!root) return;
    const startX = e.clientX;
    const startW = coworkerWidthPx ?? COWORKER_WIDTH_DEFAULT;

    const onMove = (ev: PointerEvent) => {
      const maxW = root.getBoundingClientRect().width * COWORKER_WIDTH_MAX_RATIO;
      const next = Math.min(maxW, Math.max(COWORKER_WIDTH_MIN, startW - (ev.clientX - startX)));
      setCoworkerWidthPx(next);
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
    coworkerWidthPx != null
      ? ({ "--helpdesk-coworker-w": `${Math.round(coworkerWidthPx)}px` } as React.CSSProperties)
      : undefined;

  return (
    <div
      ref={splitRef}
      className="helpdesk-v4 demo-ui-font demo-scroll-hidden"
      style={splitStyle}
      role="presentation"
    >
      <nav className="helpdesk-v4-rail" aria-label="App navigation">
        <span className="helpdesk-v4-rail-logo">
          <IconSparkles size={18} />
        </span>
        <span className="helpdesk-v4-rail-icon">
          <IconBook size={16} />
        </span>
        <span className="helpdesk-v4-rail-icon helpdesk-v4-rail-icon--active">
          <IconBell size={16} />
        </span>
        <span className="helpdesk-v4-rail-icon">
          <IconClipboard size={16} />
        </span>
        <span className="helpdesk-v4-rail-spacer" />
        <span className="helpdesk-v4-rail-icon">
          <IconSettings size={16} />
        </span>
      </nav>

      <section className="helpdesk-v4-work" aria-label="Staff workspace">
        <header className="helpdesk-v4-work-head">
          <h4>{workTitle}</h4>
          <span className="helpdesk-v4-work-pill">{workPill}</span>
        </header>

        <div className={`helpdesk-v4-work-stage helpdesk-v4-work-stage--${screen}`}>
          {screen === "chat" ? (
            <div className="helpdesk-v4-messages demo-scroll-hidden">
              {visibleMessages.map((msg) => {
                const isGuest = msg.role === "guest";
                const side = isGuest ? "guest" : msg.role === "staff" ? "staff" : "agent";
                return (
                  <div
                    key={msg.id}
                    className={`helpdesk-v4-msg helpdesk-v4-msg--${side} helpdesk-v4-msg--animate`}
                  >
                    {isGuest ? (
                      <DemoAvatar guest={GUEST} size="sm" className="helpdesk-v4-msg-avatar-ui" />
                    ) : (
                      <DemoAvatar name="Jordan Lee" initials="JL" size="sm" className="helpdesk-v4-msg-avatar-ui" />
                    )}
                    <div className="helpdesk-v4-msg-bubble">{msg.body}</div>
                  </div>
                );
              })}
            </div>
          ) : screen === "docs" ? (
            <div className="helpdesk-v4-docs helpdesk-v4-docs--solo demo-scroll-hidden">
              <h5>Riverside Hotel procedures</h5>
              {SOPS.map((sop) => (
                <article key={sop.title} className="helpdesk-v4-doc-card">
                  <h6>{sop.title}</h6>
                  <p>{sop.body}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="helpdesk-v4-ops-ghost demo-scroll-hidden" aria-label="Ops Lead board preview">
              <h5>Ops Lead</h5>
              <div className="helpdesk-v4-ops-ghost-cols">
                {OPS_GHOST_COLS.map((col) => (
                  <div key={col} className="helpdesk-v4-ops-ghost-col">
                    <span className="helpdesk-v4-ops-ghost-label">{col}</span>
                    <span className="helpdesk-v4-ops-ghost-card" />
                    <span className="helpdesk-v4-ops-ghost-card helpdesk-v4-ops-ghost-card--short" />
                    {col === "Done" ? (
                      <span className="helpdesk-v4-ops-ghost-card helpdesk-v4-ops-ghost-card--accent" />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <DemoColumnSplitter
        label="Resize workspace and Mosby panel"
        onPointerDown={onCoworkerSplitterPointerDown}
        onDoubleClick={() => setCoworkerWidthPx(null)}
      />

      <aside className="helpdesk-v4-coworker" aria-label="Mosby assistant panel">
        <header className="helpdesk-v4-coworker-head">
          <span className="helpdesk-v4-coworker-title">
            <IconSparkles size={16} /> Mosby
          </span>
          <div className="helpdesk-v4-coworker-tools" aria-hidden>
            <span>
              <IconStar size={14} />
            </span>
            <span>
              <IconPlus size={14} />
            </span>
            <span>
              <IconX size={14} />
            </span>
          </div>
        </header>

        <div className="helpdesk-v4-coworker-prompt">
          {screen === "chat"
            ? "Look up late checkout policy for Room 412"
            : screen === "docs"
              ? "Summarize SOPs for front desk handoffs"
              : "Show open tasks for today's shift"}
        </div>

        <div className="helpdesk-v4-coworker-thoughts demo-scroll-hidden" aria-label="Mosby reasoning">
          {mosbyStep >= 1 ? <p>Searched Riverside Hotel documentation</p> : <p>Thinking…</p>}
          {mosbyStep >= 2 ? <p>Matched late checkout SOP and Ops Lead task template</p> : null}
        </div>

        <p className="helpdesk-v4-coworker-reply">
          {mosbyStep >= 2
            ? "Late checkout until 1:00 PM is allowed with availability. Confirm with the guest, log the request in Ops Lead, and move the task to Done once approved."
            : "Checking hotel procedures…"}
        </p>

        {mosbyStep >= 2 && screen !== "ops" ? (
          <article className="helpdesk-v4-email-card">
            <header className="helpdesk-v4-email-head">
              <span>SOP excerpt</span>
              <span>
                <IconCopy size={14} />
              </span>
            </header>
            <p className="helpdesk-v4-email-subject">
              <strong>Late checkout policy</strong>
            </p>
            <p className="helpdesk-v4-email-body">
              Standard checkout is 11:00 AM. One-hour extensions are complimentary when occupancy allows.
              Requests until 1:00 PM require front desk confirmation and an Ops Lead task for shift handoff.
            </p>
          </article>
        ) : null}

        <footer className="helpdesk-v4-coworker-compose" aria-hidden>
          <span className="helpdesk-v4-coworker-input">Ask Mosby about hotel procedures…</span>
          <span className="helpdesk-v4-coworker-send">
            <IconArrowUp size={16} />
          </span>
        </footer>
      </aside>
    </div>
  );
}
