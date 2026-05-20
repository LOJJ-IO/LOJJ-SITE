"use client";

import { useEffect, useRef, useState } from "react";

import type { DemoChatMessage, DemoSuggestion } from "@/components/solutions/DemoSimulationContext";
import GuestPhoneHeader from "@/components/solutions/guest-phone/GuestPhoneHeader";
import { Icon2, Icon3 } from "@/components/solutions/guest-phone/icons";
import GuestBookingSheet from "@/components/solutions/GuestBookingSheet";
import PhoneProfileSheet from "@/components/solutions/PhoneProfileSheet";
import { LIVE_GUEST } from "@/lib/demo-guests";

/** Logical UI size (must match `.guest-phone-ui` in globals.css). */
const GUEST_PHONE_INNER_W = 430;
const GUEST_PHONE_INNER_H = 935;
/** Bezel asset / `.guest-phone-device` width in px — keep in sync with `globals.css`. */
const GUEST_PHONE_DEVICE_W = 360;
/** Matches `.guest-phone-screen-clip { inset: 2.2% 5.102%; }`. */
const GUEST_PHONE_CLIP_INSET_X = 0.05102;
const GUEST_PHONE_CLIP_INSET_Y = 0.022;
const GUEST_PHONE_CLIP_W = GUEST_PHONE_DEVICE_W * (1 - 2 * GUEST_PHONE_CLIP_INSET_X);
const GUEST_PHONE_DEVICE_H = (GUEST_PHONE_DEVICE_W * 1000) / 490;
const GUEST_PHONE_CLIP_H = GUEST_PHONE_DEVICE_H * (1 - 2 * GUEST_PHONE_CLIP_INSET_Y);
/** Fit inner canvas inside the screen hole without horizontal or vertical clipping. */
const GUEST_PHONE_SCALE = Math.min(
  GUEST_PHONE_CLIP_W / GUEST_PHONE_INNER_W,
  GUEST_PHONE_CLIP_H / GUEST_PHONE_INNER_H,
);
const GUEST_PHONE_TRANSLATE_X = (GUEST_PHONE_CLIP_W - GUEST_PHONE_INNER_W * GUEST_PHONE_SCALE) / 2;
const GUEST_PHONE_TRANSLATE_Y = (GUEST_PHONE_CLIP_H - GUEST_PHONE_INNER_H * GUEST_PHONE_SCALE) / 2;
const GUEST_PHONE_BEZEL_H = Math.round((GUEST_PHONE_DEVICE_W * 1000) / 490);

type GuestPhoneProps = {
  messages: DemoChatMessage[];
  suggestions: DemoSuggestion[];
  onPickSuggestion: (id: string) => void;
  highlightedSuggestionId?: string;
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
        <p className="guest-phone-thread-empty">Choose a suggested reply on the right to start the conversation.</p>
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
                {isUser ? (
                  <Icon2 className="guest-phone-bubble-tail guest-phone-bubble-tail--out" width={18} height={19} />
                ) : isLastAssistant ? (
                  <Icon2 className="guest-phone-bubble-tail" width={18} height={19} />
                ) : null}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default function GuestPhone({
  messages,
  suggestions,
  onPickSuggestion,
  highlightedSuggestionId,
}: GuestPhoneProps) {
  const [lojjOpen, setLojjOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  const openLojj = () => {
    setBookingOpen(false);
    setLojjOpen(true);
  };

  const openBooking = () => {
    setLojjOpen(false);
    setBookingOpen(true);
  };

  return (
    <div className="guest-phone-stage demo-ui-font">
      <div className="guest-phone-halo" aria-hidden />

      <div className="guest-phone-with-suggestions">
        <div className="guest-phone-device">
          <div className="guest-phone-screen-clip">
            <div
              className="guest-phone-screen-inner"
              style={{
                width: GUEST_PHONE_INNER_W,
                height: GUEST_PHONE_INNER_H,
                transform: `translate(${GUEST_PHONE_TRANSLATE_X}px, ${GUEST_PHONE_TRANSLATE_Y}px) scale(${GUEST_PHONE_SCALE})`,
              }}
            >
              <div className="guest-phone-ui">
                <GuestPhoneHeader onOpenLojj={openLojj} onOpenGuestBooking={openBooking} />
                <GuestPhoneMessageList messages={messages} />
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
                  open={lojjOpen}
                  onClose={() => setLojjOpen(false)}
                  title="Contact"
                  name="LOJJ"
                  initials="L"
                  meta={[
                    "Riverside Hotel concierge",
                    "Wi‑Fi · checkout · parking · local tips",
                    "Available 24/7 during your stay",
                  ]}
                />
                <GuestBookingSheet
                  open={bookingOpen}
                  onClose={() => setBookingOpen(false)}
                  guest={LIVE_GUEST}
                />
              </div>
            </div>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element -- device bezel frame */}
          <img
            src="/devices/iphone-14-pro-shell.png"
            alt="Decorative iPhone mockup frame"
            className="guest-phone-bezel"
            width={GUEST_PHONE_DEVICE_W}
            height={GUEST_PHONE_BEZEL_H}
            draggable={false}
          />
        </div>

        {suggestions.length > 0 ? (
          <div className="guest-phone-suggestions-rail" role="group" aria-label="Suggested replies">
            {suggestions.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`guest-phone-suggestion-chip${
                  s.id === highlightedSuggestionId ? " guest-phone-suggestion-chip--prompt" : ""
                }`}
                onClick={() => onPickSuggestion(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
