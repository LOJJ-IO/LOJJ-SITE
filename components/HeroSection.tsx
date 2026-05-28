"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import HotelHeroGraphic from "@/components/HotelHeroGraphic";
import HeroIntroTagline from "@/components/HeroIntroTagline";
import { WAITLIST_BTN_LABEL_CLASS, WaitlistDialogTrigger } from "@/components/WaitlistDialog";
import { useMatchMedia } from "@/lib/use-match-media";

const easeOut = [0.22, 1, 0.36, 1] as const;

interface HeroSectionProps {
  ready: boolean;
  onLoadProgress: (pct: number) => void;
}

export default function HeroSection({ ready, onLoadProgress }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const showHeroArt = !useMatchMedia("(width < 768px)");

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    onLoadProgress(100);
  }, [onLoadProgress]);

  useEffect(() => {
    const hero = sectionRef.current;
    const media = mediaRef.current;
    if (!hero || !media) return;

    const apply = () => {
      const pillRightPx = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--nav-features-pill-right-px"),
      );
      const mediaRect = media.getBoundingClientRect();
      // Keep ideal desktop untouched; start right-edge pin/off-screen clipping from ~1430px down.
      const w = window.innerWidth;
      if (w > 1430) {
        hero.style.setProperty("--hotel-hero-offscreen-x", "0px");
        return;
      }

      // Push media right only as needed so it doesn't sit under the About/Features pill.
      let overlapPushPx = 0;
      if (Number.isFinite(pillRightPx) && pillRightPx > 0) {
        const desiredLeft = pillRightPx + 16;
        overlapPushPx = Math.max(0, desiredLeft - mediaRect.left);
      }

      // Linear extra push between 1430 -> 1240 for smoother behavior.
      const t = Math.max(0, Math.min(1, (1430 - w) / (1430 - 1240)));
      const linearPushPx = Math.round(t * 70);
      const pushPx = Math.round(Math.max(overlapPushPx, linearPushPx));
      hero.style.setProperty("--hotel-hero-offscreen-x", `${pushPx}px`);
    };

    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(media);
    ro.observe(hero);
    window.addEventListener("resize", apply);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, []);

  const fadeUp = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18 } as const,
        animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
      };

  return (
    <section ref={sectionRef} className="hero-static w-full self-stretch" aria-label="Hero">
      <div className="hero-static-backdrop" aria-hidden>
        <div className="hero-static-backdrop__wash" />
        <div className="hero-static-backdrop__glow" />
        <div className="hero-static-backdrop__grid" />
        <div className="hero-static-backdrop__linen" />
        <div className="hero-static-backdrop__grain" />
      </div>

      <div className="hero-static-pattern-overlay" aria-hidden />

      <div className="hero-static-inner">
        <div className="hero-static-stage">
          <div className="hero-static-copy">
            <div className="hero-tagline-stack hero-static-tagline-stack">
              <div className="hero-tagline-block hero-tagline-block--primary hero-static-tagline-primary">
                <HeroIntroTagline ready={ready} reducedMotion={reducedMotion} />
              </div>

              <span className="hero-static-rule" aria-hidden />

              <motion.div
                className="hero-tagline-block hero-tagline-block--visibility hero-static-tagline-secondary"
                {...fadeUp}
                transition={{ duration: 0.62, delay: 0.68, ease: easeOut }}
              >
                <p className="hero-tagline-text hero-tagline-text--visibility">
                  Full visibility, <span className="hero-tagline-every">every</span> stay.
                </p>
              </motion.div>
            </div>

            <motion.div
              className="hero-static-cta-inline"
              {...fadeUp}
              transition={{ duration: 0.62, delay: 0.88, ease: easeOut }}
            >
              <WaitlistDialogTrigger className="hero-waitlist-trigger rotating-border-btn inline-flex h-[58px] cursor-pointer items-center justify-center gap-3 rounded-full px-11 transition-all duration-300 group button-strong-shadow pointer-events-auto sm:h-[66px] sm:px-14">
                <span className={`${WAITLIST_BTN_LABEL_CLASS} text-white transition-colors sm:text-lg`}>
                  Join the waitlist
                </span>
              </WaitlistDialogTrigger>
            </motion.div>
          </div>
        </div>
      </div>

      {showHeroArt ? (
        <div ref={mediaRef} className="hero-static-media" aria-hidden>
          <HotelHeroGraphic />
        </div>
      ) : null}
    </section>
  );
}
