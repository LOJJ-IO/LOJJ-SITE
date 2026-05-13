"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PhoneMockup from "@/components/PhoneMockup";
import { DEMO_OPS_BASE_QUEUE, useDemoSimulation } from "@/components/solutions/DemoSimulationContext";
import MagePhoneChat from "@/components/solutions/MagePhoneChat";
import type { DemoQueueItem, DemoTopic, SolutionDefinition } from "@/lib/solutions";

type SolutionWindowProps = {
  solution: SolutionDefinition;
};

const priorityClass: Record<DemoQueueItem["priority"], string> = {
  high: "demo-priority-high",
  medium: "demo-priority-medium",
  low: "demo-priority-low",
};

type CtxMenuState = { x: number; y: number } | null;

function DemoWindowChrome({
  anchor,
  ariaLabel,
  children,
  onCopyLink,
  onResetScenario,
}: {
  anchor: string;
  ariaLabel: string;
  children: React.ReactNode;
  onCopyLink: () => void;
  onResetScenario: () => void;
}) {
  const [menu, setMenu] = useState<CtxMenuState>(null);
  const shellRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => setMenu(null), []);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    const onPointer = (e: MouseEvent | PointerEvent) => {
      const t = e.target as Node | null;
      if (shellRef.current?.contains(t)) return;
      closeMenu();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [menu, closeMenu]);

  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenu({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      ref={shellRef}
      className="solution-window solution-window--ctx"
      role="region"
      aria-label={ariaLabel}
      onContextMenu={onContextMenu}
    >
      {children}
      {menu ? (
        <div
          className="demo-ctx-menu"
          style={{ left: menu.x, top: menu.y }}
          role="menu"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="demo-ctx-item"
            role="menuitem"
            onClick={() => {
              onCopyLink();
              closeMenu();
            }}
          >
            Copy link to this section
          </button>
          <button
            type="button"
            className="demo-ctx-item"
            role="menuitem"
            onClick={() => {
              onResetScenario();
              closeMenu();
            }}
          >
            Reset demo scenario
          </button>
          <a className="demo-ctx-item demo-ctx-link" href={`#${anchor}`} role="menuitem" onClick={closeMenu}>
            Jump to heading
          </a>
        </div>
      ) : null}
    </div>
  );
}

function GuestDesktopPanel() {
  const {
    guestMessages,
    guestSuggestions,
    guestPickSuggestion,
  } = useDemoSimulation();

  return (
    <div className="demo-guest-desktop">
      <p className="demo-guest-desktop-lead">
        This pane mirrors the phone transcript. Use either surface — both advance the same fixed storyline.
      </p>
      <div className="demo-guest-desktop-thread" aria-live="polite">
        {guestMessages.length === 0 ? (
          <p className="demo-guest-desktop-empty">Waiting for the first message from the phone…</p>
        ) : (
          guestMessages.map((m) => (
            <div key={m.id} className={`demo-guest-line demo-guest-line--${m.role}`}>
              <span className="demo-guest-role">{m.role === "user" ? "Guest" : "Mage"}</span>
              <p>{m.body}</p>
              <span className="demo-guest-time">{m.time}</span>
            </div>
          ))
        )}
      </div>
      {guestSuggestions.length > 0 ? (
        <div className="demo-action-list" role="group" aria-label="Guest prompts (desktop)">
          {guestSuggestions.map((s) => (
            <button key={s.id} type="button" className="demo-chip" onClick={() => guestPickSuggestion(s.id)}>
              {s.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function OpsDemoSynced() {
  const { opsExtraQueue } = useDemoSimulation();
  const merged = useMemo(
    () => [...opsExtraQueue, ...DEMO_OPS_BASE_QUEUE],
    [opsExtraQueue],
  );
  const [activeId, setActiveId] = useState(merged[0]?.id ?? "");
  const active = useMemo(
    () => merged.find((item) => item.id === activeId) ?? merged[0],
    [merged, activeId],
  );

  useEffect(() => {
    if (merged.length && !merged.some((r) => r.id === activeId)) {
      setActiveId(merged[0].id);
    }
  }, [merged, activeId]);

  return (
    <>
      <p className="demo-ops-preview-note">
        <strong>Ops preview:</strong> when Guest Expert creates a follow-up in the scripted chat, it lands
        here in real time — same payload your team would see in Ops Lead.
      </p>
      <div className="demo-queue" role="listbox" aria-label="Ops task queue">
        {merged.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`demo-row ${item.id === active?.id ? "demo-row-active" : ""} ${
              item.id === "demo-late-checkout" ? "demo-row-synced" : ""
            }`}
            onClick={() => setActiveId(item.id)}
            role="option"
            aria-selected={item.id === active?.id}
          >
            <div className="demo-row-top">
              <span>{item.title}</span>
              <span className={`demo-priority ${priorityClass[item.priority]}`}>{item.priority}</span>
            </div>
            <div className="demo-row-bottom">
              <span>{item.location}</span>
              <span>ETA {item.eta}</span>
            </div>
          </button>
        ))}
      </div>
      {active ? (
        <div className="demo-selection" aria-live="polite">
          <strong>Selected:</strong> {active.title}
          <br />
          Routing to {active.location} with {active.priority} priority. Team ETA is {active.eta}.
        </div>
      ) : null}
    </>
  );
}

function ReviewsDemoSynced() {
  const {
    reviewGuests,
    reviewActiveGuestId,
    reviewInviteSentForId,
    reviewPickSuggestion,
    reviewSuggestions,
    reviewSetActiveGuest,
  } = useDemoSimulation();

  const active = useMemo(
    () => reviewGuests.find((g) => g.id === reviewActiveGuestId) ?? reviewGuests[0],
    [reviewGuests, reviewActiveGuestId],
  );

  return (
    <>
      <p className="demo-reviews-sync-note">
        <strong>Review Specialist preview:</strong> sending an invite from the phone demo updates this board
        and highlights Maya&apos;s row when the scripted flow completes.
      </p>
      <div className="demo-queue" role="listbox" aria-label="Review candidates">
        {reviewGuests.map((guest) => (
          <button
            key={guest.id}
            type="button"
            className={`demo-row ${guest.id === active?.id ? "demo-row-active" : ""} ${
              reviewInviteSentForId === guest.id ? "demo-row-synced" : ""
            }`}
            onClick={() => reviewSetActiveGuest(guest.id)}
            role="option"
            aria-selected={guest.id === active?.id}
          >
            <div className="demo-row-top">
              <span>{guest.name}</span>
              <span>{guest.score}%</span>
            </div>
            <div className="demo-row-bottom">
              <span>{guest.signal}</span>
              <span>{reviewInviteSentForId === guest.id ? "Invite queued" : "Eligible now"}</span>
            </div>
          </button>
        ))}
      </div>
      {active ? (
        <div className="demo-selection" aria-live="polite">
          {reviewInviteSentForId === active.id ? (
            <>
              Review request queued for <strong>{active.name}</strong> with Google and Tripadvisor links (demo
              only).
            </>
          ) : (
            <>
              <strong>{active.name}</strong> is surfaced here when Review Specialist receives a positive Guest
              Expert signal. Use the phone to run the outreach script.
            </>
          )}
        </div>
      ) : null}
      {reviewSuggestions.length > 0 ? (
        <div className="demo-action-list" role="group" aria-label="Review actions (desktop)">
          {reviewSuggestions.map((s) => (
            <button key={s.id} type="button" className="demo-chip" onClick={() => reviewPickSuggestion(s.id)}>
              {s.label}
            </button>
          ))}
        </div>
      ) : null}
    </>
  );
}

function ManagerDemo({ topics = [] }: { topics?: DemoTopic[] }) {
  const [activeId, setActiveId] = useState(topics[0]?.id ?? "");
  const active = useMemo(() => topics.find((item) => item.id === activeId) ?? topics[0], [topics, activeId]);

  return (
    <>
      <div className="demo-action-list" role="group" aria-label="AI manager topics">
        {topics.map((topic) => (
          <button key={topic.id} type="button" className="demo-chip" onClick={() => setActiveId(topic.id)}>
            {topic.title}
          </button>
        ))}
      </div>
      {active ? (
        <div className="demo-response-box" aria-live="polite">
          {active.answer}
        </div>
      ) : null}
    </>
  );
}

export default function SolutionWindow({ solution }: SolutionWindowProps) {
  const demo = useDemoSimulation();

  const copyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#${solution.anchor}`;
    void navigator.clipboard.writeText(url).catch(() => null);
  };

  const resetScenario = () => {
    if (solution.id === "guest") demo.resetGuestDemo();
    else if (solution.id === "ops") demo.resetOpsExtras();
    else if (solution.id === "reviews") demo.resetReviewDemo();
    else if (solution.id === "manager") {
      /* local state lives inside ManagerDemo — soft reset via reload section not ideal; no-op */
    }
  };

  return (
    <article id={solution.anchor} className="solution-panel glass-panel-clear">
      <div className="solution-grid">
        <div className="solution-copy">
          <div className="feature-kicker">{solution.kicker}</div>
          <h3 className="landing-h3">{solution.heading}</h3>
          <p className="landing-p">{solution.lede}</p>
          <ul className="solution-bullets">
            {solution.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          <p className="solution-note">{solution.panelNote}</p>
          {solution.id === "guest" ? (
            <PhoneMockup alt="Mage guest chat (interactive demo)">
              <MagePhoneChat
                variant="guest"
                title="Mage"
                messages={demo.guestMessages}
                suggestions={demo.guestSuggestions}
                onPickSuggestion={demo.guestPickSuggestion}
              />
            </PhoneMockup>
          ) : null}
          {solution.id === "reviews" ? (
            <PhoneMockup alt="Mage review outreach (interactive demo)">
              <MagePhoneChat
                variant="reviews"
                title="Mage"
                badge="Reviews"
                messages={demo.reviewMessages}
                suggestions={demo.reviewSuggestions}
                onPickSuggestion={demo.reviewPickSuggestion}
              />
            </PhoneMockup>
          ) : null}
          {solution.id === "manager" && solution.phoneImage ? (
            <PhoneMockup image={solution.phoneImage} alt={`${solution.heading} mobile interface`} />
          ) : null}
        </div>

        <DemoWindowChrome
          anchor={solution.anchor}
          ariaLabel={`${solution.heading} interactive demo`}
          onCopyLink={copyLink}
          onResetScenario={resetScenario}
        >
          <div className="solution-window-bar">
            <span className="window-dots" aria-hidden>
              <span className="window-dot" />
              <span className="window-dot" />
              <span className="window-dot" />
            </span>
            <span className="window-title">{solution.demo.title}</span>
            <span className="window-live-pill">Interactive</span>
          </div>
          <div className="solution-window-body">
            <p className="demo-subtitle">{solution.demo.subtitle}</p>
            {solution.id === "guest" ? <GuestDesktopPanel /> : null}
            {solution.id === "ops" ? <OpsDemoSynced /> : null}
            {solution.id === "reviews" ? <ReviewsDemoSynced /> : null}
            {solution.id === "manager" ? <ManagerDemo topics={solution.demo.topics} /> : null}
          </div>
        </DemoWindowChrome>
      </div>
    </article>
  );
}
