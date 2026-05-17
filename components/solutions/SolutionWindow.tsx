"use client";

import { useEffect, useId, useMemo, useState } from "react";
import DemoWindowChrome from "@/components/solutions/DemoWindowChrome";
import PhoneMockup from "@/components/PhoneMockup";
import {
  useDemoSimulation,
  type DemoChatMessage,
  type ReviewSentDemoEntry,
} from "@/components/solutions/DemoSimulationContext";
import MagePhoneChat from "@/components/solutions/MagePhoneChat";
import ReviewGuestPhone from "@/components/solutions/ReviewGuestPhone";
import ManagerSplitDemo from "@/components/solutions/ManagerSplitDemo";
import type { SolutionDefinition } from "@/lib/solutions";

type SolutionWindowProps = {
  solution: SolutionDefinition;
};

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
  { href: "#help-desk", label: "View Help Desk" },
] as const;

const GUEST_BROWSER_TABS: BrowserTabDef[] = [
  { id: "chat", label: "Live chat", favicon: "◆" },
  { id: "related", label: "Related", favicon: "★" },
];

function GuestDesktopPanel() {
  const { guestMessages, guestAppend, guestJumpShowOps, guestJumpShowReviews, guestJumpShowManager } =
    useDemoSimulation();

  const [staffComposeForId, setStaffComposeForId] = useState<string | null>(null);
  const [staffDraft, setStaffDraft] = useState("");

  const guestRoleLabel = (role: DemoChatMessage["role"]) => {
    if (role === "user") return "Guest";
    if (role === "staff") return "Staff";
    return "Mage";
  };

  const [demoTab, setDemoTab] = useState<"chat" | "related">("chat");

  const visibleJumps = useMemo(
    () =>
      GUEST_DEMO_JUMP_LINKS.filter((item) => {
        if (item.href === "#ops-lead") return guestJumpShowOps;
        if (item.href === "#review-specialist") return guestJumpShowReviews;
        if (item.href === "#help-desk") return guestJumpShowManager;
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
        ariaLabel="Guest chat views"
      />

      {demoTab === "chat" ? (
        <div className="demo-guest-desktop">
          <div className="demo-guest-desktop-thread" aria-live="polite">
            {guestMessages.length === 0 ? (
              <p className="demo-guest-desktop-empty">Waiting for the first message from the phone…</p>
            ) : (
              guestMessages.map((m) =>
                m.role === "assistant" ? (
                  <div key={m.id} className="demo-guest-assistant-wrap">
                    <div className="demo-guest-assistant-row">
                      <div className="demo-guest-line demo-guest-line--assistant">
                        <span className="demo-guest-role">Mage</span>
                        <p>{m.body}</p>
                        <span className="demo-guest-time">{m.time}</span>
                      </div>
                      <button
                        type="button"
                        className="demo-guest-jump-in-btn"
                        onClick={() => {
                          setStaffComposeForId((open) => (open === m.id ? null : m.id));
                          setStaffDraft("");
                        }}
                      >
                        Jump in
                      </button>
                    </div>
                    {staffComposeForId === m.id ? (
                      <div className="demo-guest-staff-compose">
                        <label className="demo-guest-staff-label" htmlFor={`staff-reply-${m.id}`}>
                          Reply as staff
                        </label>
                        <textarea
                          id={`staff-reply-${m.id}`}
                          className="demo-guest-staff-input"
                          rows={3}
                          value={staffDraft}
                          onChange={(e) => setStaffDraft(e.target.value)}
                          placeholder="Your message to the guest…"
                        />
                        <div className="demo-guest-staff-actions">
                          <button
                            type="button"
                            className="demo-chip"
                            onClick={() => {
                              const t = staffDraft.trim();
                              if (t) guestAppend("staff", t);
                              setStaffComposeForId(null);
                              setStaffDraft("");
                            }}
                          >
                            Send
                          </button>
                          <button
                            type="button"
                            className="demo-guest-staff-cancel"
                            onClick={() => {
                              setStaffComposeForId(null);
                              setStaffDraft("");
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div key={m.id} className={`demo-guest-line demo-guest-line--${m.role}`}>
                    <span className="demo-guest-role">{guestRoleLabel(m.role)}</span>
                    <p>{m.body}</p>
                    <span className="demo-guest-time">{m.time}</span>
                  </div>
                ),
              )
            )}
          </div>
        </div>
      ) : (
        <div className="demo-guest-desktop">
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
            <p className="demo-guest-desktop-empty">Nothing unlocked yet.</p>
          )}
        </div>
      )}
    </>
  );
}

const REVIEWS_BROWSER_TABS: BrowserTabDef[] = [
  { id: "board", label: "Outreach board", favicon: "◆" },
  { id: "posted", label: "Posted reviews", favicon: "★" },
];

function ReviewsDemoSynced() {
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
        ariaLabel="Review Specialist views"
      />

      {demoTab === "board" ? (
        <>
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

export default function SolutionWindow({ solution }: SolutionWindowProps) {
  const demo = useDemoSimulation();
  const [managerDemoKey, setManagerDemoKey] = useState(0);

  const copyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#${solution.anchor}`;
    void navigator.clipboard.writeText(url).catch(() => null);
  };

  const resetScenario = () => {
    if (solution.id === "guest") demo.resetGuestDemo();
    else if (solution.id === "ops") demo.resetOpsExtras();
    else if (solution.id === "reviews") demo.resetReviewDemo();
    else if (solution.id === "manager") {
      setManagerDemoKey((k) => k + 1);
    }
  };

  const hasPhone =
    solution.id === "guest" ||
    solution.id === "reviews" ||
    (solution.id === "manager" && Boolean(solution.phoneImage));
  const usesBrowserShell = solution.id === "guest" || solution.id === "reviews";

  const explanatory = (
    <div
      className={`solution-panel-explanatory${hasPhone ? "" : " solution-panel-explanatory--side"}`}
    >
      <h3 className="landing-h3">{solution.heading}</h3>
      <p className="landing-p solution-summary">{solution.summary}</p>
    </div>
  );

  const demoCol = (
    <div className="solution-demo-col">
      <DemoWindowChrome
        anchor={solution.anchor}
        ariaLabel={`${solution.heading} interactive preview`}
        onCopyLink={copyLink}
        onResetScenario={resetScenario}
        shellClassName={
          solution.id === "guest"
            ? "solution-window--guest-tall"
            : solution.id === "manager"
              ? "solution-window--manager-split"
              : undefined
        }
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
          {solution.id === "guest" ? <GuestDesktopPanel /> : null}
          {solution.id === "reviews" ? (
            <ReviewsDemoSynced />
          ) : null}
          {solution.id === "manager" && solution.demo.topics ? (
            <ManagerSplitDemo key={managerDemoKey} topics={solution.demo.topics} />
          ) : null}
        </div>
      </DemoWindowChrome>
    </div>
  );

  return (
    <article
      id={solution.anchor}
      className={`solution-panel${solution.id === "manager" ? " solution-panel--viewport" : ""}`}
    >
      <div className="solution-panel-stack">
        {hasPhone ? (
          <>
            {explanatory}
            <div className="solution-panel-rule" aria-hidden />
            <div className="solution-demo-row solution-demo-row--split">
              <div className="solution-phone-col">
                {solution.id === "guest" ? (
                  <PhoneMockup alt="Mage guest chat">
                    <MagePhoneChat
                      variant="guest"
                      title="Mage"
                      messages={demo.guestMessages}
                      suggestions={demo.guestSuggestions}
                      onPickSuggestion={demo.guestPickSuggestion}
                      idleInstructions={solution.summary}
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
              {demoCol}
            </div>
          </>
        ) : (
          <div className="solution-demo-row solution-demo-row--sidecopy">
            {explanatory}
            <div className="solution-demo-gutter" aria-hidden />
            {demoCol}
          </div>
        )}
      </div>
    </article>
  );
}
