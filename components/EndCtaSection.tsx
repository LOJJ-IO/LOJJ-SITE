"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

import { WaitlistDialogTrigger } from "@/components/WaitlistDialog";
import { Highlighter } from "@/components/ui/highlighter";

function LojjFaceMark() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });

  const eye = {
    hidden: { opacity: 0, y: 28, scale: 0.92 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 220, damping: 22 },
    },
  };

  const mouth = {
    hidden: { opacity: 0, scale: 0.6 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { delay: 0.45, type: "spring", stiffness: 260, damping: 20 },
    },
  };

  return (
    <div ref={ref} className="lojj-face" aria-hidden>
      <motion.div
        className="lojj-face-eyes"
        animate={inView ? { y: [0, -5, 0] } : { y: 0 }}
        transition={
          inView
            ? { duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 1.1 }
            : undefined
        }
      >
        <motion.span
          className="lojj-face-eye font-romantica"
          variants={eye}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ delay: 0.08 }}
        >
          J
        </motion.span>
        <motion.span
          className="lojj-face-eye font-romantica"
          variants={eye}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ delay: 0.22 }}
        >
          J
        </motion.span>
      </motion.div>
      <motion.svg
        className="lojj-face-mouth"
        viewBox="0 0 16 16"
        width={28}
        height={28}
        variants={mouth}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        aria-hidden
      >
        <path
          d="M11 11 H2 V2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>
    </div>
  );
}

export default function EndCtaSection() {
  return (
    <section className="landing-end-cta" aria-labelledby="end-cta-heading">
      <div className="landing-end-cta-inner">
        <LojjFaceMark />

        <div className="landing-end-cta-copy">
          <h2 id="end-cta-heading" className="landing-end-cta-title">
            We{" "}
            <Highlighter action="underline" color="rgb(34, 61, 20)" strokeWidth={2} isView>
              see
            </Highlighter>{" "}
            you&apos;ve made it to the end.
          </h2>
          <p className="landing-end-cta-sub">
            Gain visibility across your hotel, guarantee outcomes on every guest thread, and turn great stays into
            reviews—without adding headcount.
          </p>
          <div className="landing-end-cta-actions">
            <WaitlistDialogTrigger className="landing-end-cta-btn rotating-border-btn inline-flex items-center justify-center gap-3 px-10 sm:px-12 h-[52px] sm:h-[58px] rounded-full transition-all duration-300 button-strong-shadow cursor-pointer">
              <span className="font-bold text-base tracking-tight">Join the waitlist</span>
            </WaitlistDialogTrigger>
            <a
              href="mailto:info@lojj.io?subject=Talk%20to%20sales"
              className="pill-btn-ghost landing-end-cta-sales-btn"
            >
              Talk to sales
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
