"use client";

import { motion, type Variants } from "motion/react";

const easeOut = [0.22, 1, 0.36, 1] as const;

const chunk: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, delay, ease: easeOut },
  }),
};

const everyVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.62,
    rotate: -7,
    filter: "blur(10px)",
    display: "inline-block",
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    filter: "blur(0px)",
    display: "inline-block",
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
      delay: 0.38,
    },
  },
};

interface HeroIntroTaglineProps {
  ready: boolean;
  reducedMotion: boolean;
}

export default function HeroIntroTagline({ ready, reducedMotion }: HeroIntroTaglineProps) {
  if (reducedMotion) {
    return (
      <p className="hero-tagline-text hero-tagline-text--primary">
        Your best, <span className="hero-tagline-every">every</span> time.
      </p>
    );
  }

  return (
    <motion.p
      className="hero-tagline-text hero-tagline-text--primary"
      initial="hidden"
      animate={ready ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.14, delayChildren: 0.06 } },
      }}
      aria-label="Your best, every time."
    >
      <motion.span className="hero-tagline-chunk" variants={chunk} custom={0.05}>
        Your best,
      </motion.span>{" "}
      <motion.span className="hero-tagline-every" variants={everyVariants}>
        every
      </motion.span>{" "}
      <motion.span className="hero-tagline-chunk" variants={chunk} custom={0.58}>
        time.
      </motion.span>
    </motion.p>
  );
}
