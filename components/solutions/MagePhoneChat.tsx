"use client";

import { useEffect, useId, useRef, useState } from "react";

import type { DemoChatMessage, DemoSuggestion } from "@/components/solutions/DemoSimulationContext";

function MageGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden className="mage-phone-logo">
      <rect x="3" y="3" width="18" height="18" rx="4" fill="currentColor" />
      <rect x="7" y="7" width="4" height="4" rx="0.5" fill="#fff" />
      <rect x="13" y="7" width="4" height="4" rx="0.5" fill="#fff" />
      <rect x="7" y="13" width="4" height="4" rx="0.5" fill="#fff" />
      <rect x="13" y="13" width="4" height="4" rx="0.5" fill="#fff" />
    </svg>
  );
}

function ProfileGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden className="mage-phone-profile">
      <circle cx="12" cy="9" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M5.5 20.5c1.2-3.5 3.8-5 6.5-5s5.3 1.5 6.5 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

type MagePhoneChatProps = {
  variant: "guest" | "reviews";
  title: string;
  badge?: string;
  messages: DemoChatMessage[];
  suggestions: DemoSuggestion[];
  onPickSuggestion: (id: string) => void;
  composerPlaceholder?: string;
  /** Primary line when the thread is empty (before any messages). */
  idleLead?: string;
  /** Extra demo copy shown only on the phone when the thread is empty (e.g. storyline + tips). */
  idleInstructions?: string;
  /** Shown in the profile sheet (guest-style mock). */
  profileGuestName?: string;
  profileRoomLabel?: string;
  profileStayLabel?: string;
};

export default function MagePhoneChat({
  variant,
  title,
  badge,
  messages,
  suggestions,
  onPickSuggestion,
  composerPlaceholder = "Message…",
  idleLead = "Tap a suggested reply below to begin.",
  idleInstructions,
  profileGuestName = "Alex Rivera",
  profileRoomLabel = "Room 312 · Riverside",
  profileStayLabel = "Stay · through Sun",
}: MagePhoneChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileTitleId = useId();
  const profileSheetId = useId();

  const profileInitials = (() => {
    const parts = profileGuestName.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
    }
    const w = parts[0] ?? "?";
    return w.slice(0, 2).toUpperCase();
  })();

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (!profileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setProfileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [profileOpen]);

  return (
    <div className={`mage-phone-chat mage-phone-chat--${variant}`}>
      <header className="mage-phone-header mage-phone-header--kit">
        <div className="mage-phone-header-start">
          <MageGlyph />
        </div>
        <div className="mage-phone-header-center">
          <div className="mage-phone-title-stack">
            <span className="mage-phone-title">{title}</span>
            {badge ? <span className="mage-phone-badge">{badge}</span> : null}
          </div>
        </div>
        <div className="mage-phone-header-end">
          <button
            type="button"
            className={`mage-phone-icon-btn${profileOpen ? " mage-phone-icon-btn--active" : ""}`}
            aria-label="Guest profile"
            aria-expanded={profileOpen}
            aria-controls={profileSheetId}
            onClick={() => setProfileOpen((o) => !o)}
          >
            <ProfileGlyph />
          </button>
        </div>
      </header>

      <div
        className={`mage-phone-thread${messages.length === 0 ? " mage-phone-thread--idle" : ""}`}
        ref={scrollRef}
      >
        {messages.length === 0 ? (
          <div className="mage-phone-empty-stack">
            <p className="mage-phone-empty">{idleLead}</p>
            {idleInstructions ? (
              <p className="mage-phone-empty mage-phone-empty--secondary">{idleInstructions}</p>
            ) : null}
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`mage-phone-row mage-phone-row--${m.role}`}>
              <div className={`mage-phone-bubble mage-phone-bubble--${m.role}`}>
                <p className="mage-phone-bubble-text">{m.body}</p>
                <span className="mage-phone-time">{m.time}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {suggestions.length > 0 ? (
        <div className="mage-phone-chips mage-phone-chips--kit" role="group" aria-label="Suggested replies">
          {suggestions.map((s) => (
            <button key={s.id} type="button" className="mage-phone-chip" onClick={() => onPickSuggestion(s.id)}>
              {s.label}
            </button>
          ))}
        </div>
      ) : null}

      <div className="mage-phone-composer" aria-hidden>
        <span className="mage-phone-composer-icon" title="Attach">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19A4 4 0 1 1 18 12l-8.69 8.69a2 2 0 0 1-2.83-2.83l8.49-8.49" />
          </svg>
        </span>
        <div className="mage-phone-input-faux">{composerPlaceholder}</div>
        <span className="mage-phone-composer-icon" title="Voice input">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3z" />
            <path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4M8 22h8" />
          </svg>
        </span>
      </div>

      {profileOpen ? (
        <>
          <button
            type="button"
            className="mage-phone-profile-scrim"
            aria-label="Close profile"
            onClick={() => setProfileOpen(false)}
          />
          <aside
            id={profileSheetId}
            className="mage-phone-profile-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby={profileTitleId}
          >
            <div className="mage-phone-profile-sheet-handle" aria-hidden />
            <h2 id={profileTitleId} className="mage-phone-profile-title">
              Guest
            </h2>
            <div className="mage-phone-profile-avatar" aria-hidden>
              {profileInitials}
            </div>
            <p className="mage-phone-profile-name">{profileGuestName}</p>
            <ul className="mage-phone-profile-meta">
              <li>{profileRoomLabel}</li>
              <li>{profileStayLabel}</li>
              <li>Signed in via hotel chat</li>
            </ul>
            <button type="button" className="mage-phone-profile-done" onClick={() => setProfileOpen(false)}>
              Done
            </button>
          </aside>
        </>
      ) : null}
    </div>
  );
}
