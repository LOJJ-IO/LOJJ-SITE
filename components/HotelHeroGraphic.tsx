"use client";

import { useEffect, useMemo, useState } from "react";

import {
  getHeroGuestUserMessage,
  useDemoSimulation,
  type HeroGuestScenarioId,
} from "@/components/solutions/DemoSimulationContext";
import { Icon2 } from "@/components/solutions/guest-phone/icons";

type Hotspot = {
  id: string;
  scenarioId: HeroGuestScenarioId;
  /** Percentage-based positioning relative to the image box */
  leftPct: number;
  topPct: number;
  sizePx: number;
  tooltip: string;
};

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

export default function HotelHeroGraphic() {
  const demo = useDemoSimulation();
  const [reducedMotion, setReducedMotion] = useState(true);
  /** Stacked pool-hours teaser (matches hero mockup). */
  const [poolPhase, setPoolPhase] = useState<"off" | "question" | "answered">("off");

  useEffect(() => {
    setReducedMotion(prefersReducedMotion());
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const t1 = window.setTimeout(() => setPoolPhase("question"), 1600);
    const t2 = window.setTimeout(() => setPoolPhase("answered"), 4000);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [reducedMotion]);

  const hotspots = useMemo<Hotspot[]>(
    () => [
      // Mockup: middle floor left-ish; slightly higher toward right façade.
      {
        id: "click-towels",
        scenarioId: "towels",
        leftPct: 42,
        topPct: 52,
        sizePx: 44,
        tooltip: getHeroGuestUserMessage("towels"),
      },
      {
        id: "click-crib",
        scenarioId: "crib",
        leftPct: 70,
        topPct: 32,
        sizePx: 44,
        tooltip: getHeroGuestUserMessage("crib"),
      },
    ],
    [],
  );

  const scrollToGuestExpert = () => {
    const el = document.getElementById("guest-expert");
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onClickScenario = (scenarioId: HeroGuestScenarioId) => {
    demo.playHeroScenario(scenarioId);
    scrollToGuestExpert();
  };

  return (
    <div className="hotel-hero">
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
        {/* Stacked autoplay: Pool hours → hours (hero mockup) */}
        {reducedMotion ? (
          <HotelHeroPoolMessages showReply />
        ) : poolPhase !== "off" ? (
          <HotelHeroPoolMessages showReply={poolPhase === "answered"} animate />
        ) : null}

        {/* Tap-to-ask concierge beacons */}
        {hotspots.map((h) => (
            <button
              key={h.id}
              type="button"
              className="hotel-hero-hotspot hotel-hero-hotspot--beacon"
              style={{
                left: `${h.leftPct}%`,
                top: `${h.topPct}%`,
                width: h.sizePx,
                height: h.sizePx,
              }}
              onClick={() => onClickScenario(h.scenarioId)}
              aria-label={h.tooltip}
            >
              <span className="hotel-hero-hotspot-tooltip" role="tooltip">
                {h.tooltip}
              </span>
              <span className="hotel-hero-hotspot-beacon" aria-hidden>
                <span className="hotel-hero-hotspot-beacon-pulse" />
                <span className="hotel-hero-hotspot-beacon-pulse hotel-hero-hotspot-beacon-pulse--delayed" />
                <span className="hotel-hero-hotspot-beacon-core">
                  <svg
                    className="hotel-hero-hotspot-icon"
                    viewBox="0 0 14 11"
                    width="14"
                    height="11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 1.75h12M1 5.5H9M1 9.25h10"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </span>
            </button>
          ))}
      </div>
    </div>
  );
}

