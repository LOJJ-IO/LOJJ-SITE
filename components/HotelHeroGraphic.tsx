"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import HeroRequestPin from "@/components/HeroRequestPin";
import {
  getHeroGuestUserMessage,
  useDemoSimulation,
  type HeroGuestScenarioId,
} from "@/components/solutions/DemoSimulationContext";
import { Icon2 } from "@/components/solutions/guest-phone/icons";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Same bubble markup as `GuestPhone`; each message is its own absolutely positioned layer. */
function HotelHeroPoolMessages({
  showReply,
  animate = false,
}: {
  showReply: boolean;
  animate?: boolean;
}) {
  return (
    <>
      <div className="hotel-hero-pool-msg hotel-hero-pool-msg--question" aria-label="Pool hours preview">
        <div
          className={`guest-phone-row guest-phone-row--out${animate ? " hotel-hero-pool-bubble--in" : ""}`}
        >
          <div className="guest-phone-bubble guest-phone-bubble--out demo-ui-font">
            <span>What are the pool hours?</span>
            <Icon2 className="guest-phone-bubble-tail guest-phone-bubble-tail--out" width={18} height={19} />
          </div>
        </div>
      </div>
      {showReply ? (
        <div className="hotel-hero-pool-msg hotel-hero-pool-msg--reply">
          <div
            className={`guest-phone-row guest-phone-row--in${animate ? " hotel-hero-pool-bubble--in hotel-hero-pool-bubble--reply" : ""}`}
          >
            <div className="guest-phone-bubble guest-phone-bubble--in demo-ui-font">
              <span>Open daily, 5&nbsp;AM – 11&nbsp;PM.</span>
              <Icon2 className="guest-phone-bubble-tail" width={18} height={19} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

type RequestPinConfig = {
  scenarioId: HeroGuestScenarioId;
  align: "left" | "right";
  /** Window-aligned placement on the riverside hero art (%) */
  left: string;
  top: string;
};

const REQUEST_PINS: RequestPinConfig[] = [
  // Moved to the circled window on the right tower.
  { scenarioId: "towels", align: "left", left: "58.6%", top: "63.8%" },
  { scenarioId: "crib", align: "right", left: "64.4%", top: "39.6%" },
];

/** After pool reply animation (~0.9s) before request pins enter */
const PINS_AFTER_POOL_MS = 950;
const PIN_STAGGER_MS = 220;

export default function HotelHeroGraphic() {
  const demo = useDemoSimulation();
  const [reducedMotion, setReducedMotion] = useState(true);
  const [poolPhase, setPoolPhase] = useState<"off" | "question" | "answered">("off");
  const [pinsActive, setPinsActive] = useState(false);

  useEffect(() => {
    setReducedMotion(prefersReducedMotion());
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setPoolPhase("answered");
      setPinsActive(true);
      return;
    }
    setPoolPhase("off");
    setPinsActive(false);
    const t1 = window.setTimeout(() => setPoolPhase("question"), 1600);
    const t2 = window.setTimeout(() => setPoolPhase("answered"), 4000);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    if (poolPhase !== "answered") {
      setPinsActive(false);
      return;
    }
    const t = window.setTimeout(() => setPinsActive(true), PINS_AFTER_POOL_MS);
    return () => window.clearTimeout(t);
  }, [poolPhase, reducedMotion]);

  const pins = useMemo(
    () =>
      REQUEST_PINS.map((pin) => ({
        ...pin,
        question: getHeroGuestUserMessage(pin.scenarioId),
      })),
    [],
  );

  const scrollToGuestExpert = useCallback(() => {
    const el = document.getElementById("guest-expert");
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const onActivateScenario = useCallback(
    (scenarioId: HeroGuestScenarioId) => {
      demo.setHeroIntent({ scenarioId });
      scrollToGuestExpert();
    },
    [demo, scrollToGuestExpert],
  );

  return (
    <div className="hotel-hero">
      <div className="hotel-hero-art-frame">
        <div className="hotel-hero-visual">
          {/* eslint-disable-next-line @next/next/no-img-element -- hero art is static and pre-optimized */}
          <img
            src="/hotel/riverside-hero-ebeee3.webp"
            alt="Isometric view of Riverside Hotel"
            className="hotel-hero-img"
            draggable={false}
          />
        </div>

        <div className="hotel-hero-overlays" aria-hidden={false}>
          {reducedMotion ? (
            <HotelHeroPoolMessages showReply />
          ) : poolPhase !== "off" ? (
            <HotelHeroPoolMessages showReply={poolPhase === "answered"} animate />
          ) : null}

          {pins.map((pin, index) => (
            <HeroRequestPin
              key={pin.scenarioId}
              scenarioId={pin.scenarioId}
              question={pin.question}
              left={pin.left}
              top={pin.top}
              align={pin.align}
              active={pinsActive}
              entranceDelayMs={index * PIN_STAGGER_MS}
              onActivate={onActivateScenario}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
