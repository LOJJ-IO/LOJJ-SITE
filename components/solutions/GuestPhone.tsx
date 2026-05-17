"use client";

import { useEffect, useRef, useState } from "react";

import type { DemoChatMessage, DemoSuggestion } from "@/components/solutions/DemoSimulationContext";
import GuestPhoneHeader from "@/components/solutions/guest-phone/GuestPhoneHeader";
import { Icon2, Icon3 } from "@/components/solutions/guest-phone/icons";
import PhoneProfileSheet from "@/components/solutions/PhoneProfileSheet";

const GUEST_PHONE_SCALE = 0.750802;
const GUEST_PHONE_INNER_W = 430;
const GUEST_PHONE_INNER_H = 935;
const GUEST_PHONE_TRANSLATE_X = 0.0775401;

type GuestPhoneProps = {
  messages: DemoChatMessage[];
  suggestions: DemoSuggestion[];
  onPickSuggestion: (id: string) => void;
};

function GuestPhoneMessageList({ messages }: { messages: DemoChatMessage[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  const isEmpty = messages.length === 0;

  return (
    <div ref={scrollRef} className={`guest-phone-thread${isEmpty ? " guest-phone-thread--empty" : ""}`}>
      {isEmpty ? (
        <p className="guest-phone-thread-empty">Choose a suggested reply below to start the conversation.</p>
      ) : (
        messages.map((m, i) => {
          const isUser = m.role === "user";
          const isStaff = m.role === "staff";
          const isLastAssistant =
            m.role === "assistant" && messages[i + 1]?.role !== "assistant";
          return (
            <div
              key={m.id}
              className={`guest-phone-row guest-phone-row--${isUser ? "out" : "in"}${isStaff ? " guest-phone-row--staff" : ""}`}
            >
              <div className={`guest-phone-bubble guest-phone-bubble--${isUser ? "out" : isStaff ? "staff" : "in"}`}>
                <span>{m.body}</span>
                {isLastAssistant ? <Icon2 className="guest-phone-bubble-tail" width={18} height={19} /> : null}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default function GuestPhone({ messages, suggestions, onPickSuggestion }: GuestPhoneProps) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="guest-phone-stage">
      <div className="guest-phone-halo" aria-hidden />

      <div className="guest-phone-device">
        <div className="guest-phone-screen-clip">
          <div
            className="guest-phone-screen-inner"
            style={{
              width: GUEST_PHONE_INNER_W,
              height: GUEST_PHONE_INNER_H,
              transform: `translate(${GUEST_PHONE_TRANSLATE_X}px, 0) scale(${GUEST_PHONE_SCALE})`,
            }}
          >
            <div className="guest-phone-ui">
              <GuestPhoneHeader onOpenProfile={() => setProfileOpen(true)} />
              <GuestPhoneMessageList messages={messages} />
              {suggestions.length > 0 ? (
                <div className="guest-phone-chips" role="group" aria-label="Suggested replies">
                  {suggestions.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className="guest-phone-chip"
                      onClick={() => onPickSuggestion(s.id)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              ) : null}
              <footer className="guest-phone-composer" aria-hidden>
                <span className="guest-phone-composer-plus" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                    <path d="M9 3.5v11M3.5 9h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                <div className="guest-phone-composer-field" aria-hidden />
                <span className="guest-phone-composer-mic" aria-hidden>
                  <Icon3 width={22} height={22} />
                </span>
              </footer>

              <PhoneProfileSheet
                open={profileOpen}
                onClose={() => setProfileOpen(false)}
                title="Contact"
                name="LOJJ"
                initials="L"
                meta={[
                  "Hotel concierge assistant",
                  "Room 412 · Live demo",
                  "Wi‑Fi · checkout · parking · local tips",
                ]}
              />
            </div>
          </div>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element -- device bezel frame */}
        <img
          src="/devices/iphone-14-pro-shell.png"
          alt="Decorative iPhone mockup frame"
          className="guest-phone-bezel"
          width={275}
          height={562}
          draggable={false}
        />
      </div>
    </div>
  );
}

