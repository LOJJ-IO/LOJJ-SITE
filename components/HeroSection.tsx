"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import HotelHeroGraphic from "@/components/HotelHeroGraphic";
import HeroIntroTagline from "@/components/HeroIntroTagline";
import { WAITLIST_BTN_LABEL_CLASS, WaitlistDialogTrigger } from "@/components/WaitlistDialog";

interface HeroSectionProps {
  ready: boolean;
  onLoadProgress: (pct: number) => void;
}

export default function HeroSection({ ready, onLoadProgress }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    // Previous hero reported progress as frames loaded; static hero is immediate.
    onLoadProgress(100);
  }, [onLoadProgress]);

  return (
    <section ref={sectionRef} className="hero-static w-full self-stretch" aria-label="Hero">
      <div className="hero-static-inner">
        <div className="hero-static-stage">
          <div className="hero-static-copy">
            <div className="hero-tagline-stack hero-static-tagline-stack">
              <div className="hero-tagline-block hero-tagline-block--primary hero-static-tagline-primary">
                <HeroIntroTagline ready={ready} reducedMotion={reducedMotion} />
              </div>

              <div className="hero-tagline-block hero-tagline-block--visibility hero-static-tagline-secondary">
                <p className="hero-tagline-text hero-tagline-text--visibility">
                  Full visibility, <span className="hero-tagline-every">every</span> stay.
                </p>
              </div>
            </div>

            <motion.div
              className="hero-static-cta-inline"
              initial={reducedMotion ? false : { opacity: 0, y: 22 }}
              animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
              transition={{ duration: 0.65, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
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

      <div className="hero-static-media" aria-hidden>
        <HotelHeroGraphic />
      </div>
    </section>
  );
}

