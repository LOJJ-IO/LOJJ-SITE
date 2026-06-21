"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import type { DemoChatMessage } from "@/components/solutions/DemoSimulationContext";
import GuestPhoneHeader from "@/components/solutions/guest-phone/GuestPhoneHeader";
import { Icon2, Icon3 } from "@/components/solutions/guest-phone/icons";
import GuestBookingSheet from "@/components/solutions/GuestBookingSheet";
import PhoneProfileSheet from "@/components/solutions/PhoneProfileSheet";
import { LIVE_GUEST } from "@/lib/demo-guests";
import { demoChatTypingDuration } from "@/lib/demo-chat-animation";

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

type GuestPhoneFit = { scale: number; tx: number; ty: number };

const DEFAULT_GUEST_PHONE_FIT: GuestPhoneFit = {
  scale: GUEST_PHONE_SCALE,
  tx: GUEST_PHONE_TRANSLATE_X,
  ty: GUEST_PHONE_TRANSLATE_Y,
};

function useGuestPhoneScreenFit(clipRef: React.RefObject<HTMLDivElement | null>): GuestPhoneFit {
  const [fit, setFit] = useState<GuestPhoneFit>(DEFAULT_GUEST_PHONE_FIT);

  useLayoutEffect(() => {
    const clip = clipRef.current;
    if (!clip) return;

    const update = () => {
      const { width: clipW, height: clipH } = clip.getBoundingClientRect();
      if (clipW <= 0 || clipH <= 0) return;
      const scale = Math.min(clipW / GUEST_PHONE_INNER_W, clipH / GUEST_PHONE_INNER_H);
      setFit({
        scale,
        tx: (clipW - GUEST_PHONE_INNER_W * scale) / 2,
        ty: (clipH - GUEST_PHONE_INNER_H * scale) / 2,
      });
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(clip);
    return () => ro.disconnect();
  }, [clipRef]);

  return fit;
}

const GUEST_PHONE_INTRO = [
  "Hello, I'm LOJJ.",
  "I am here to help with Wi‑Fi, checkout, parking, and anything about your stay.",
] as const;

const INTRO_TYPING_MS = [650, 950] as const;

function GuestPhoneTypingBubble({
  variant,
  showTail,
}: {
  variant: "in" | "out" | "staff";
  showTail?: boolean;
}) {
  return (
    <div className={`guest-phone-bubble guest-phone-bubble--${variant} guest-phone-bubble--typing`}>
      <span className="guest-phone-typing-dots" aria-label="Typing">
        <span />
        <span />
        <span />
      </span>
      {showTail && variant === "in" ? (
        <Icon2 className="guest-phone-bubble-tail" width={18} height={19} />
      ) : null}
      {showTail && variant === "out" ? (
        <Icon2 className="guest-phone-bubble-tail guest-phone-bubble-tail--out" width={18} height={19} />
      ) : null}
    </div>
  );
}

function GuestPhoneIntroSequence({
  active,
  showTailOnLast,
  onPhaseChange,
}: {
  active: boolean;
  showTailOnLast: boolean;
  onPhaseChange: () => void;
}) {
  /** -1 = waiting for in-view, 0 = typing msg1, 1 = msg1 visible, 2 = typing msg2, 3 = msg2 visible */
  const [step, setStep] = useState(-1);

  useEffect(() => {
    if (!active) {
      setStep(-1);
      return;
    }

    setStep(0);
    const timers = [
      window.setTimeout(() => setStep(1), INTRO_TYPING_MS[0]),
      window.setTimeout(() => setStep(2), INTRO_TYPING_MS[0] + 380),
      window.setTimeout(() => setStep(3), INTRO_TYPING_MS[0] + 380 + INTRO_TYPING_MS[1]),
    ];
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [active]);

  useEffect(() => {
    if (step < 0) return;
    onPhaseChange();
  }, [step, onPhaseChange]);

  if (step < 0) return null;

  return (
    <>
      {step === 0 ? (
        <div className="guest-phone-row guest-phone-row--in">
          <GuestPhoneTypingBubble variant="in" />
        </div>
      ) : (
        <div className="guest-phone-row guest-phone-row--in">
          <div className="guest-phone-bubble guest-phone-bubble--in guest-phone-bubble--appear">
            <span>{GUEST_PHONE_INTRO[0]}</span>
          </div>
        </div>
      )}

      {step >= 2 ? (
        step === 2 ? (
          <div className="guest-phone-row guest-phone-row--in">
            <GuestPhoneTypingBubble variant="in" />
          </div>
        ) : (
          <div className="guest-phone-row guest-phone-row--in">
            <div className="guest-phone-bubble guest-phone-bubble--in guest-phone-bubble--appear">
              <span>{GUEST_PHONE_INTRO[1]}</span>
              {showTailOnLast ? (
                <Icon2 className="guest-phone-bubble-tail" width={18} height={19} />
              ) : null}
            </div>
          </div>
        )
      ) : null}
    </>
  );
}

function GuestPhoneAnimatedMessage({
  message,
  showTail,
  onPhaseChange,
}: {
  message: DemoChatMessage;
  showTail: boolean;
  onPhaseChange: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const isUser = message.role === "user";
  const isStaff = message.role === "staff";
  const variant = isUser ? "out" : isStaff ? "staff" : "in";

  useEffect(() => {
    setRevealed(false);
    const ms = demoChatTypingDuration(message.body, message.role);
    const timer = window.setTimeout(() => setRevealed(true), ms);
    return () => window.clearTimeout(timer);
  }, [message.id, message.body, message.role]);

  useEffect(() => {
    onPhaseChange();
  }, [revealed, onPhaseChange]);

  if (!revealed) {
    return (
      <div
        className={`guest-phone-row guest-phone-row--${isUser ? "out" : "in"}${isStaff ? " guest-phone-row--staff" : ""}`}
      >
        <GuestPhoneTypingBubble variant={variant} />
      </div>
    );
  }

  return (
    <div
      className={`guest-phone-row guest-phone-row--${isUser ? "out" : "in"}${isStaff ? " guest-phone-row--staff" : ""}`}
    >
      <div
        className={`guest-phone-bubble guest-phone-bubble--${variant} guest-phone-bubble--appear`}
      >
        <span>{message.body}</span>
        {isUser ? (
          <Icon2 className="guest-phone-bubble-tail guest-phone-bubble-tail--out" width={18} height={19} />
        ) : showTail ? (
          <Icon2 className="guest-phone-bubble-tail" width={18} height={19} />
        ) : null}
      </div>
    </div>
  );
}

type GuestPhoneProps = {
  messages: DemoChatMessage[];
  introActive: boolean;
};

function GuestPhoneMessageList({
  messages,
  introActive,
}: {
  messages: DemoChatMessage[];
  introActive: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const shouldStickToBottomRef = useRef(true);
  const [introKey, setIntroKey] = useState(0);
  const hadMessagesRef = useRef(false);

  useEffect(() => {
    if (messages.length > 0) {
      hadMessagesRef.current = true;
      return;
    }
    if (hadMessagesRef.current) {
      hadMessagesRef.current = false;
      setIntroKey((key) => key + 1);
    }
  }, [messages.length]);

  const scrollThread = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (messages.length === 0) {
      el.scrollTop = el.scrollHeight;
      return;
    }
    if (!shouldStickToBottomRef.current) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      // If the user scrolls up, stop forcing to bottom.
      const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      shouldStickToBottomRef.current = distanceFromBottom < 80;
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useLayoutEffect(() => {
    scrollThread();
  }, [messages, scrollThread]);

  return (
    <div
      ref={scrollRef}
      className="guest-phone-thread guest-phone-thread--intro"
      onWheelCapture={(e) => {
        // Prevent the page from scrolling when pointer is over the phone thread.
        e.stopPropagation();
      }}
      onTouchMoveCapture={(e) => {
        // Same for touch scroll chaining.
        e.stopPropagation();
      }}
    >
      <GuestPhoneIntroSequence
        key={introKey}
        active={introActive}
        showTailOnLast={messages.length === 0}
        onPhaseChange={scrollThread}
      />
      {messages.map((m, i) => {
        const isLastAssistant = m.role === "assistant" && messages[i + 1]?.role !== "assistant";
        return (
          <GuestPhoneAnimatedMessage
            key={m.id}
            message={m}
            showTail={isLastAssistant}
            onPhaseChange={scrollThread}
          />
        );
      })}
    </div>
  );
}

export default function GuestPhone({ messages, introActive }: GuestPhoneProps) {
  const [lojjOpen, setLojjOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const clipRef = useRef<HTMLDivElement>(null);
  const { scale, tx, ty } = useGuestPhoneScreenFit(clipRef);

  const openLojj = () => {
    setBookingOpen(false);
    setLojjOpen(true);
  };

  const openBooking = () => {
    setLojjOpen(false);
    setBookingOpen(true);
  };

  return (
    <div className="guest-phone-stage demo-ui-font guest-phone-stage--autoplay">
      <div className="guest-phone-halo" aria-hidden />

      <div className="guest-phone-device">
        <div ref={clipRef} className="guest-phone-screen-clip">
          <div
            className="guest-phone-screen-inner"
            style={{
              width: GUEST_PHONE_INNER_W,
              height: GUEST_PHONE_INNER_H,
              transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
            }}
          >
            <div className="guest-phone-ui">
              <GuestPhoneHeader onOpenLojj={openLojj} onOpenGuestBooking={openBooking} />
              <GuestPhoneMessageList messages={messages} introActive={introActive} />
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
    </div>
  );
}
