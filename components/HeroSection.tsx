"use client";

import { useEffect, useRef } from "react";
import { WaitlistDialogTrigger } from "./WaitlistDialog";
import ScrollCanvas from "./ScrollCanvas";

type PinPhase = "before" | "pinned" | "after";

const PIN_CLASSES = [
  "hero-pin-layer--before",
  "hero-pin-layer--pinned",
  "hero-pin-layer--after",
] as const;

interface HeroSectionProps {
  ready: boolean;
  onLoadProgress: (pct: number) => void;
}

export default function HeroSection({ ready, onLoadProgress }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinLayerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const pinPhaseRef = useRef<PinPhase | null>(null);

  useEffect(() => {
    if (!sectionRef.current || !pinLayerRef.current) return;

    function applyPinPhase(phase: PinPhase) {
      const el = pinLayerRef.current;
      if (!el || pinPhaseRef.current === phase) return;
      el.classList.remove(...PIN_CLASSES);
      el.classList.add(`hero-pin-layer--${phase}`);
      pinPhaseRef.current = phase;
    }

    function tick() {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const sectionHeight = el.offsetHeight;
      const scrollable = sectionHeight - viewportHeight;

      let phase: PinPhase;
      if (rect.top > 0) {
        phase = "before";
      } else if (rect.bottom > viewportHeight) {
        phase = "pinned";
      } else {
        phase = "after";
      }
      applyPinPhase(phase);

      if (scrollable <= 0) {
        progressRef.current = 0;
        return;
      }
      const scrolled = -rect.top;
      progressRef.current = Math.max(0, Math.min(1, scrolled / scrollable));
    }

    function scheduleTick() {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        tick();
        rafRef.current = null;
      });
    }

    tick();
    window.addEventListener("scroll", scheduleTick, { passive: true });
    window.addEventListener("resize", scheduleTick, { passive: true });

    return () => {
      window.removeEventListener("scroll", scheduleTick);
      window.removeEventListener("resize", scheduleTick);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      pinPhaseRef.current = null;
    };
  }, []);

  return (
    <section ref={sectionRef} className="hero-scroll-runway w-full self-stretch" aria-label="Hero">
      <div className="hero-scroll-spacer" aria-hidden />
      <div ref={pinLayerRef} className="hero-pin-layer hero-pin-layer--before">
        <div className="hero-canvas-shell">
          <ScrollCanvas
            progressRef={progressRef}
            ready={ready}
            onLoadProgress={onLoadProgress}
          />
        </div>
        <div className="hero-tagline-stack">
          <p className="hero-tagline-text">
            Your best, <em>every</em> time.
          </p>
          <div className="hero-tagline-cta">
            <WaitlistDialogTrigger className="hero-waitlist-trigger rotating-border-btn inline-flex items-center justify-center gap-3 px-11 sm:px-14 h-[58px] sm:h-[66px] rounded-full transition-all duration-300 group button-strong-shadow pointer-events-auto cursor-pointer">
              <span className="text-white font-bold text-base sm:text-lg tracking-tight transition-colors">
                Join the waitlist
              </span>
            </WaitlistDialogTrigger>
          </div>
        </div>
      </div>
    </section>
  );
}
