"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import ResizableDemoWindow from "@/components/solutions/ResizableDemoWindow";
import PhoneMockup from "@/components/PhoneMockup";
import { DEMO_OPS_BASE_QUEUE, useDemoSimulation, type ReviewSentDemoEntry } from "@/components/solutions/DemoSimulationContext";
import MagePhoneChat from "@/components/solutions/MagePhoneChat";
import ReviewGuestPhone from "@/components/solutions/ReviewGuestPhone";
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
      <ResizableDemoWindow className="solution-window-aspect-root flex w-full min-h-0 min-w-0 flex-col overflow-hidden">
        {children}
      </ResizableDemoWindow>
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
            Reset scenario
          </button>
          <a className="demo-ctx-item demo-ctx-link" href={`#${anchor}`} role="menuitem" onClick={closeMenu}>
            Jump to heading
          </a>
        </div>
      ) : null}
    </div>
  );
}

type BrowserTabDef = { id: string; label: string; favicon: string };

function DemoBrowserShell({
  tabs,
  activeTab,
  onChangeTab,
  url,
  infoTooltip,
  ariaLabel,
}: {
  tabs: BrowserTabDef[];
  activeTab: string;
  onChangeTab: (id: string) => void;
  url: string;
  infoTooltip?: string;
  ariaLabel?: string;
}) {
  const infoId = useId();
  return (
    <div className="demo-browser-shell" role="presentation">
      <div
        className="demo-browser-tabstrip"
        role="tablist"
        aria-label={ariaLabel ?? "Browser views"}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`demo-browser-tab ${activeTab === tab.id ? "demo-browser-tab-active" : ""}`}
            onClick={() => onChangeTab(tab.id)}
          >
            <span className="demo-browser-tab-favicon" aria-hidden>
              {tab.favicon}
            </span>
            <span className="demo-browser-tab-title">{tab.label}</span>
          </button>
        ))}
        <span className="demo-browser-tab-plus" aria-hidden title="New tab">
          +
        </span>
      </div>
      <div className="demo-browser-toolbar">
        <div className="demo-browser-nav" aria-hidden>
          <span className="demo-browser-nav-btn">‹</span>
          <span className="demo-browser-nav-btn demo-browser-nav-btn-disabled">›</span>
          <span className="demo-browser-nav-btn">↻</span>
        </div>
        <div className="demo-browser-urlbar">
          <span className="demo-browser-url-icon" aria-hidden>
            ⎘
          </span>
          <span className="demo-browser-url-text">{url}</span>
          {infoTooltip ? (
            <span className="demo-browser-url-info">
              <button
                type="button"
                className="demo-browser-url-info-btn"
                aria-label="How this works"
                aria-describedby={infoId}
              >
                <span aria-hidden>ⓘ</span>
              </button>
              <span
                id={infoId}
                role="tooltip"
                className="demo-browser-url-info-pop"
              >
                {infoTooltip}
              </span>
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

const GUEST_DEMO_JUMP_LINKS = [
  { href: "#ops-lead", label: "View task board (Ops Lead)" },
  { href: "#review-specialist", label: "View Review Specialist" },
  { href: "#ai-manager", label: "View AI Manager" },
] as const;

const GUEST_BROWSER_TABS: BrowserTabDef[] = [
  { id: "chat", label: "Live chat", favicon: "◆" },
  { id: "related", label: "Related", favicon: "★" },
];

function GuestDesktopPanel({ subtitleTooltip }: { subtitleTooltip?: string }) {
  const {
    guestMessages,
    guestSuggestions,
    guestPickSuggestion,
    guestJumpShowOps,
    guestJumpShowReviews,
    guestJumpShowManager,
  } = useDemoSimulation();

  const [demoTab, setDemoTab] = useState<"chat" | "related">("chat");

  const visibleJumps = useMemo(
    () =>
      GUEST_DEMO_JUMP_LINKS.filter((item) => {
        if (item.href === "#ops-lead") return guestJumpShowOps;
        if (item.href === "#review-specialist") return guestJumpShowReviews;
        if (item.href === "#ai-manager") return guestJumpShowManager;
        return false;
      }),
    [guestJumpShowManager, guestJumpShowOps, guestJumpShowReviews],
  );

  const demoUrlPath = demoTab === "chat" ? "/chat" : "/related";

  return (
    <>
      <DemoBrowserShell
        tabs={GUEST_BROWSER_TABS}
        activeTab={demoTab}
        onChangeTab={(id) => setDemoTab(id as "chat" | "related")}
        url={`yourhotel.lojj.io/guest${demoUrlPath}`}
        infoTooltip={subtitleTooltip}
        ariaLabel="Guest chat views"
      />

      {demoTab === "chat" ? (
        <div className="demo-guest-desktop">
          <p className="demo-guest-desktop-lead">
            This pane mirrors the phone transcript. Use either surface — both follow the same storyline.
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
      ) : (
        <div className="demo-guest-desktop">
          <p className="demo-guest-desktop-lead">
            Cross-links to related walkthroughs appear here as the conversation unlocks them.
          </p>
          {visibleJumps.length > 0 ? (
            <div className="demo-guest-jump" role="navigation" aria-label="Related solutions">
              <span className="demo-guest-jump-label">Related on this page</span>
              <div className="demo-guest-jump-row">
                {visibleJumps.map((item) => (
                  <a key={item.href} href={item.href} className="demo-chip demo-link-chip">
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <p className="demo-guest-desktop-empty">
              Nothing here yet — try the late checkout, review, or escalation flows on the phone to surface links.
            </p>
          )}
        </div>
      )}
    </>
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
        <strong>Ops preview:</strong> when Guest Expert creates a follow-up in the scripted chat, it lands here in real
        time — the same payload your team would see in Ops Lead.
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

const REVIEWS_BROWSER_TABS: BrowserTabDef[] = [
  { id: "board", label: "Outreach board", favicon: "◆" },
  { id: "posted", label: "Posted reviews", favicon: "★" },
];

function ReviewsDemoSynced({ subtitleTooltip }: { subtitleTooltip?: string }) {
  const {
    reviewGuests,
    reviewActiveGuestId,
    reviewInviteSentForId,
    reviewGuestReviewSubmitted,
    reviewGuestScreen,
    reviewSetActiveGuest,
    resetReviewDemo,
    requestStaffReviewForGuest,
    reviewSentDemos,
  } = useDemoSimulation();

  const [demoTab, setDemoTab] = useState<"board" | "posted">("board");
  const [postedInspect, setPostedInspect] = useState<ReviewSentDemoEntry | null>(null);

  useEffect(() => {
    if (!postedInspect) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPostedInspect(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [postedInspect]);

  const active = useMemo(
    () => reviewGuests.find((g) => g.id === reviewActiveGuestId) ?? reviewGuests[0],
    [reviewGuests, reviewActiveGuestId],
  );

  const postedReviews = useMemo(
    () => reviewSentDemos.filter((e) => e.kind === "guest_submitted"),
    [reviewSentDemos],
  );

  const demoUrlPath = demoTab === "board" ? "/board" : "/posted";

  return (
    <>
      <DemoBrowserShell
        tabs={REVIEWS_BROWSER_TABS}
        activeTab={demoTab}
        onChangeTab={(id) => setDemoTab(id as "board" | "posted")}
        url={`yourhotel.lojj.io/reviews${demoUrlPath}`}
        infoTooltip={subtitleTooltip}
        ariaLabel="Review Specialist views"
      />

      {demoTab === "board" ? (
        <>
          <p className="demo-reviews-sync-note">
            <strong>Review Specialist preview:</strong> request a review for any guest below — it opens a personalized
            message on the guest phone. Guest Expert&apos;s &quot;No, thanks&quot; flow still mirrors here for Maya.
          </p>
          <div className="demo-queue" role="listbox" aria-label="Review candidates">
            {reviewGuests.map((guest) => (
              <div
                key={guest.id}
                className={`demo-review-guest-row ${
                  guest.id === active?.id ? "demo-review-guest-row--active" : ""
                } ${reviewInviteSentForId === guest.id ? "demo-review-guest-row--synced" : ""}`}
              >
                <button
                  type="button"
                  className={`demo-row demo-row--in-split ${guest.id === active?.id ? "demo-row-active" : ""} ${
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
                    <span>
                      {reviewGuestReviewSubmitted && reviewInviteSentForId === guest.id
                        ? "Posted"
                        : reviewInviteSentForId === guest.id
                          ? "Prompt live"
                          : "Eligible now"}
                    </span>
                  </div>
                </button>
                <button
                  type="button"
                  className="demo-request-review-btn"
                  onClick={() => requestStaffReviewForGuest(guest.id)}
                >
                  Request review
                </button>
              </div>
            ))}
          </div>
          {active ? (
            <div className="demo-selection" aria-live="polite">
              {reviewInviteSentForId === active.id ? (
                reviewGuestReviewSubmitted ? (
                  <>
                    <strong>{active.name}</strong> finished Post review on the guest phone.
                  </>
                ) : reviewGuestScreen === "compose" ? (
                  <>
                    Guest is on <strong>Post review</strong> on the phone — pre-filled 5★ draft for{" "}
                    <strong>{active.name}</strong>.
                  </>
                ) : reviewGuestScreen === "staff_request" && reviewInviteSentForId === active.id ? (
                  <>
                    Personalized request is open on the guest phone for <strong>{active.name}</strong>. Use{" "}
                    <strong>Post review</strong> there to continue.
                  </>
                ) : (
                  <>
                    Review prompt on the guest phone for <strong>{active.name}</strong>. Open Post review on the phone
                    to continue.
                  </>
                )
              ) : (
                <>
                  <strong>{active.name}</strong> — select a row or tap Request review. Guest Expert can populate Maya via
                  the scripted chat.
                </>
              )}
            </div>
          ) : null}
        </>
      ) : (
        <div className="demo-review-sent-panel">
          <p className="demo-review-sent-intro">
            Reviews submitted from the guest phone in this session (5★ flow). Outbound staff requests are not listed
            here.
          </p>
          <div className="demo-review-sent-scroll" role="feed" aria-label="Posted reviews">
            {postedReviews.length === 0 ? (
              <p className="demo-review-sent-empty">
                No posted reviews yet — complete Post review on the guest phone for any guest.
              </p>
            ) : (
              postedReviews.map((entry) => (
                <div
                  key={entry.id}
                  className="demo-review-sent-card"
                  onContextMenu={(e) => {
                    e.preventDefault();
                    if (entry.reviewBody ?? entry.preview) setPostedInspect(entry);
                  }}
                >
                  <div className="demo-review-sent-card-top">
                    <span className="demo-review-sent-name">{entry.guestName}</span>
                    <span className="demo-review-sent-time">{entry.time}</span>
                  </div>
                  <div className="demo-review-sent-card-actions">
                    <span className="demo-review-sent-kind">Posted · 5★</span>
                    <button
                      type="button"
                      className="demo-review-sent-view-btn"
                      onClick={() => setPostedInspect(entry)}
                    >
                      View full
                    </button>
                  </div>
                  <p className="demo-review-sent-preview">{entry.preview}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div className="demo-action-list" role="group" aria-label="Review session">
        <button type="button" className="demo-chip" onClick={() => resetReviewDemo()}>
          Reset review flow
        </button>
      </div>

      {postedInspect ? (
        <div
          className="demo-posted-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="demo-posted-review-title"
          onClick={() => setPostedInspect(null)}
        >
          <div className="demo-posted-modal" onClick={(e) => e.stopPropagation()}>
            <h4 id="demo-posted-review-title" className="demo-posted-modal-title">
              {postedInspect.guestName}
            </h4>
            <p className="demo-posted-modal-stars" aria-label="5 out of 5 stars">
              ★★★★★
            </p>
            <p className="demo-posted-modal-body">{postedInspect.reviewBody ?? postedInspect.preview}</p>
            <button type="button" className="demo-chip" onClick={() => setPostedInspect(null)}>
              Close
            </button>
          </div>
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
  const demoSubtitleHintId = useId();
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

  const hasPhone =
    solution.id === "guest" ||
    solution.id === "reviews" ||
    (solution.id === "manager" && Boolean(solution.phoneImage));
  const usesBrowserShell = solution.id === "guest" || solution.id === "reviews";

  return (
    <article
      id={solution.anchor}
      className="solution-panel glass-panel-clear"
    >
      <div className="solution-panel-stack">
        <div className="solution-panel-explanatory">
          <h3 className="landing-h3">{solution.heading}</h3>
          <p className="landing-p">{solution.lede}</p>
          <ul className="solution-bullets">
            {solution.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          {(solution.id === "guest" || solution.id === "reviews") && solution.demo.subtitle ? (
            <p className="solution-demo-lead">{solution.demo.subtitle}</p>
          ) : null}
          <p className="solution-note">{solution.panelNote}</p>
        </div>

        <div className="solution-panel-rule" aria-hidden />

        <div
          className={`solution-demo-row${hasPhone ? " solution-demo-row--split" : " solution-demo-row--full"}`}
        >
          {hasPhone ? (
            <>
              <div className="solution-phone-col">
                {solution.id === "guest" ? (
                  <PhoneMockup alt="Mage guest chat">
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
                  <PhoneMockup alt="Guest review request">
                    <ReviewGuestPhone />
                  </PhoneMockup>
                ) : null}
                {solution.id === "manager" && solution.phoneImage ? (
                  <PhoneMockup image={solution.phoneImage} alt={`${solution.heading} mobile interface`} />
                ) : null}
              </div>
              <div className="solution-demo-gutter" aria-hidden />
            </>
          ) : null}

          <div className="solution-demo-col">
            <DemoWindowChrome
              anchor={solution.anchor}
              ariaLabel={`${solution.heading} interactive preview`}
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
              </div>
              <div className={`solution-window-body${usesBrowserShell ? " solution-window-body--browser-first" : ""}`}>
                {!usesBrowserShell && (solution.demo.subtitle || solution.demo.subtitleTooltip) ? (
                  <div
                    className={`demo-subtitle-row${solution.demo.subtitle ? "" : " demo-subtitle-row--hint-only"}`}
                  >
                    {solution.demo.subtitle ? <p className="demo-subtitle">{solution.demo.subtitle}</p> : null}
                    {solution.demo.subtitleTooltip ? (
                      <span className="demo-subtitle-hint">
                        <button
                          type="button"
                          className="demo-subtitle-hint-btn"
                          aria-label="How this works"
                          aria-describedby={demoSubtitleHintId}
                        >
                          <span aria-hidden>ⓘ</span>
                        </button>
                        <span id={demoSubtitleHintId} role="tooltip" className="demo-subtitle-hint-pop">
                          {solution.demo.subtitleTooltip}
                        </span>
                      </span>
                    ) : null}
                  </div>
                ) : null}
                {solution.id === "guest" ? (
                  <GuestDesktopPanel subtitleTooltip={solution.demo.subtitleTooltip} />
                ) : null}
                {solution.id === "ops" ? <OpsDemoSynced /> : null}
                {solution.id === "reviews" ? (
                  <ReviewsDemoSynced subtitleTooltip={solution.demo.subtitleTooltip} />
                ) : null}
                {solution.id === "manager" ? <ManagerDemo topics={solution.demo.topics} /> : null}
              </div>
            </DemoWindowChrome>
          </div>
        </div>
      </div>
    </article>
  );
}
