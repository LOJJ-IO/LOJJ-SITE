"use client";

import { useEffect, useRef } from "react";

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
};

export default function MagePhoneChat({
  variant,
  title,
  badge,
  messages,
  suggestions,
  onPickSuggestion,
  composerPlaceholder = "Message…",
}: MagePhoneChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  return (
    <div className={`mage-phone-chat mage-phone-chat--${variant}`}>
      <header className="mage-phone-header">
        <div className="mage-phone-header-left">
          <MageGlyph />
          <div className="mage-phone-title-stack">
            <span className="mage-phone-title">{title}</span>
            {badge ? <span className="mage-phone-badge">{badge}</span> : null}
          </div>
        </div>
        <button type="button" className="mage-phone-icon-btn" aria-label="Profile (demo)">
          <ProfileGlyph />
        </button>
      </header>

      <div className="mage-phone-thread" ref={scrollRef}>
        {messages.length === 0 ? (
          <p className="mage-phone-empty">Tap a suggested reply below to start the scripted demo.</p>
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
        <div className="mage-phone-chips" role="group" aria-label="Suggested replies">
          {suggestions.map((s) => (
            <button key={s.id} type="button" className="mage-phone-chip" onClick={() => onPickSuggestion(s.id)}>
              {s.label}
            </button>
          ))}
        </div>
      ) : null}

      <div className="mage-phone-composer" aria-hidden>
        <span className="mage-phone-composer-icon" title="Attach (demo)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19A4 4 0 1 1 18 12l-8.69 8.69a2 2 0 0 1-2.83-2.83l8.49-8.49" />
          </svg>
        </span>
        <div className="mage-phone-input-faux">{composerPlaceholder}</div>
        <span className="mage-phone-composer-icon" title="Voice (demo)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3z" />
            <path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4M8 22h8" />
          </svg>
        </span>
      </div>
    </div>
  );
}
