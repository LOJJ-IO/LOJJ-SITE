"use client";

import { useEffect, useRef, useState } from "react";

import type { DemoChatMessage, DemoSuggestion } from "@/components/solutions/DemoSimulationContext";
import FolkIMessageHeader from "@/components/solutions/folk/FolkIMessageHeader";
import { Icon2, Icon3 } from "@/components/solutions/folk/icons";
import PhoneProfileSheet from "@/components/solutions/PhoneProfileSheet";

const FOLK_SCALE = 0.750802;
const FOLK_INNER_W = 430;
const FOLK_INNER_H = 935;
const FOLK_TRANSLATE_X = 0.0775401;

type GuestFolkPhoneProps = {
  messages: DemoChatMessage[];
  suggestions: DemoSuggestion[];
  onPickSuggestion: (id: string) => void;
};

function FolkMessageList({ messages }: { messages: DemoChatMessage[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  const isEmpty = messages.length === 0;

  return (
    <div ref={scrollRef} className={`folk-thread${isEmpty ? " folk-thread--empty" : ""}`}>
      {isEmpty ? (
        <p className="folk-thread-empty">Choose a suggested reply below to start the conversation.</p>
      ) : (
        messages.map((m, i) => {
          const isUser = m.role === "user";
          const isLastIn = !isUser && i === messages.length - 1;
          return (
            <div key={m.id} className={`folk-row folk-row--${isUser ? "out" : "in"}`}>
              <div className={`folk-bubble folk-bubble--${isUser ? "out" : "in"}`}>
                <span>{m.body}</span>
                {isLastIn ? <Icon2 className="folk-bubble-tail" width={18} height={19} /> : null}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default function GuestFolkPhone({ messages, suggestions, onPickSuggestion }: GuestFolkPhoneProps) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="folk-phone-stage">
      <div className="folk-phone-halo" aria-hidden />

      <div className="folk-phone-device">
        <div className="folk-phone-screen-clip">
          <div
            className="folk-phone-screen-inner"
            style={{
              width: FOLK_INNER_W,
              height: FOLK_INNER_H,
              transform: `translate(${FOLK_TRANSLATE_X}px, 0) scale(${FOLK_SCALE})`,
            }}
          >
            <div className="folk-phone-ui">
              <FolkIMessageHeader onOpenProfile={() => setProfileOpen(true)} />
              <FolkMessageList messages={messages} />
              {suggestions.length > 0 ? (
                <div className="folk-chips" role="group" aria-label="Suggested replies">
                  {suggestions.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className="folk-chip"
                      onClick={() => onPickSuggestion(s.id)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              ) : null}
              <footer className="folk-composer" aria-hidden>
                <span className="folk-composer-plus" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                    <path d="M9 3.5v11M3.5 9h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                <div className="folk-composer-field" aria-hidden />
                <span className="folk-composer-mic" aria-hidden>
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
          alt=""
          className="folk-phone-bezel"
          width={275}
          height={562}
          draggable={false}
        />
      </div>
    </div>
  );
}
