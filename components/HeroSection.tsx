"use client";

import { motion } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import HeroIntroTagline from "@/components/HeroIntroTagline";
import ScrollCanvas from "@/components/ScrollCanvas";
import { WaitlistDialogTrigger } from "@/components/WaitlistDialog";
import { Lens } from "@/components/ui/lens";
import { heroTaglineExitT, heroVisibilityEntranceT } from "@/lib/hero-scroll";

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
  const taglinePrimaryRef = useRef<HTMLDivElement>(null);
  const taglineVisibilityRef = useRef<HTMLDivElement>(null);
  const lensLayerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const pinPhaseRef = useRef<PinPhase | null>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [lensPosition, setLensPosition] = useState<{ x: number; y: number } | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  const exitT = heroTaglineExitT(scrollProgress);
  const visibilityT = heroVisibilityEntranceT(scrollProgress);
  const updateLensCenter = useCallback(() => {
    const el = pinLayerRef.current;
    if (!el) return;
    const w = el.clientWidth;
    const h = el.clientHeight;
    if (w <= 0 || h <= 0) return;
    setLensPosition({
      x: w * 0.5,
      y: h * 0.48,
    });
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useLayoutEffect(() => {
    if (!ready) return;
    updateLensCenter();
    requestAnimationFrame(() => {
      updateLensCenter();
      window.dispatchEvent(new Event("scroll"));
    });
  }, [ready, updateLensCenter]);

  useEffect(() => {
    window.addEventListener("resize", updateLensCenter, { passive: true });
    return () => window.removeEventListener("resize", updateLensCenter);
  }, [updateLensCenter]);

  useEffect(() => {
    if (!sectionRef.current || !pinLayerRef.current) return;

    function applyPinPhase(phase: PinPhase) {
      const el = pinLayerRef.current;
      if (!el || pinPhaseRef.current === phase) return;
      el.classList.remove(...PIN_CLASSES);
      el.classList.add(`hero-pin-layer--${phase}`);
      pinPhaseRef.current = phase;
    }

    function applyScrollMotion(progress: number) {
      const pinEl = pinLayerRef.current;
      const primaryEl = taglinePrimaryRef.current;
      const visibilityEl = taglineVisibilityRef.current;
      const lensEl = lensLayerRef.current;

      const exit = heroTaglineExitT(progress);
      const vis = heroVisibilityEntranceT(progress);

      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (primaryEl) {
        if (prefersReduced) {
          primaryEl.style.opacity = exit < 1 ? String(1 - exit) : "1";
          primaryEl.style.transform = "none";
        } else {
          const scale = 1 + exit * 0.48;
          primaryEl.style.opacity = String(1 - exit);
          primaryEl.style.transform = `scale(${scale})`;
          primaryEl.style.pointerEvents = exit > 0.92 ? "none" : "";
        }
      }

      if (visibilityEl) {
        const scale = 0.9 + vis * 0.1;
        visibilityEl.style.opacity = String(vis);
        visibilityEl.style.transform = `scale(${scale})`;
        visibilityEl.style.pointerEvents = vis < 0.08 ? "none" : "";
      }

      if (lensEl) {
        lensEl.style.opacity = String(vis);
        lensEl.style.pointerEvents = vis < 0.15 ? "none" : "";
      }

      pinEl?.style.setProperty("--hero-wash", String(Math.max(0, 1 - progress / 0.22)));
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
        setScrollProgress(0);
        applyScrollMotion(0);
        return;
      }

      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollable));
      progressRef.current = progress;
      setScrollProgress(progress);
      applyScrollMotion(progress);
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

  useEffect(() => {
    if (!ready) return;
    pinLayerRef.current?.style.setProperty("--hero-wash", "1");
    window.dispatchEvent(new Event("scroll"));
  }, [ready]);

  return (
    <section ref={sectionRef} className="hero-scroll-runway w-full self-stretch" aria-label="Hero">
      <div className="hero-scroll-spacer" aria-hidden />
      <motion.div ref={pinLayerRef} className="hero-pin-layer hero-pin-layer--before">
        <div className="hero-media-stack">
          <motion.div className="hero-canvas-shell hero-canvas-shell--blurred">
            <ScrollCanvas
              progressRef={progressRef}
              ready={ready}
              onLoadProgress={onLoadProgress}
            />
          </motion.div>

          {ready && lensPosition && (
            <motion.div ref={lensLayerRef} className="hero-lens-layer" aria-hidden={visibilityT < 0.05}>
              <Lens
                className="hero-lens h-full w-full rounded-none"
                zoomFactor={1.55}
                lensSize={260}
                lensColor="white"
                defaultPosition={lensPosition}
                duration={0.2}
                ariaLabel="Sharp detail through the lens"
              >
                <motion.div className="hero-canvas-shell hero-canvas-shell--sharp">
                  <ScrollCanvas progressRef={progressRef} ready={ready} />
                </motion.div>
              </Lens>
            </motion.div>
          )}
        </div>

        <motion.div className="hero-tagline-stack">
          <motion.div
            ref={taglinePrimaryRef}
            className="hero-tagline-block hero-tagline-block--primary"
            style={
              reducedMotion
                ? undefined
                : { transformOrigin: "center center", willChange: "transform, opacity" }
            }
          >
            <HeroIntroTagline ready={ready} reducedMotion={reducedMotion} />
          </motion.div>

          <motion.div
            ref={taglineVisibilityRef}
            className="hero-tagline-block hero-tagline-block--visibility"
            style={{ transformOrigin: "center center", willChange: "transform, opacity" }}
            aria-hidden={visibilityT < 0.05}
          >
            <p className="hero-tagline-text hero-tagline-text--visibility">
              Full visibility, <em>every</em> stay.
            </p>
          </motion.div>

          <motion.div
            className="hero-tagline-cta"
            initial={reducedMotion ? false : { opacity: 0, y: 22 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
            transition={{ duration: 0.65, delay: 0.92, ease: [0.22, 1, 0.36, 1] }}
          >
            <WaitlistDialogTrigger className="hero-waitlist-trigger rotating-border-btn inline-flex h-[58px] cursor-pointer items-center justify-center gap-3 rounded-full px-11 transition-all duration-300 group button-strong-shadow pointer-events-auto sm:h-[66px] sm:px-14">
              <span className="text-base font-bold tracking-tight text-white transition-colors sm:text-lg">
                Join the waitlist
              </span>
            </WaitlistDialogTrigger>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
