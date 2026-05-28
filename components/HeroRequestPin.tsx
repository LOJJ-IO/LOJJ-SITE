"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";

import type { HeroGuestScenarioId } from "@/components/solutions/DemoSimulationContext";
import { useMatchMedia } from "@/lib/use-match-media";

type PinAlign = "left" | "right";

const PIN_ICONS: Partial<Record<HeroGuestScenarioId, { src: string; alt: string }>> = {
  towels: { src: "/hotel/hero-icon-towels.png", alt: "" },
  crib: { src: "/hotel/hero-icon-crib.png", alt: "" },
};

type HeroRequestPinProps = {
  scenarioId: HeroGuestScenarioId;
  question: string;
  left: string;
  top: string;
  align?: PinAlign;
  /** Parent gates visibility until pool sequence finishes */
  active: boolean;
  /** Stagger entrance after `active` (ms) */
  entranceDelayMs?: number;
  onActivate: (scenarioId: HeroGuestScenarioId) => void;
};

export default function HeroRequestPin({
  scenarioId,
  question,
  left,
  top,
  align = "left",
  active,
  entranceDelayMs = 0,
  onActivate,
}: HeroRequestPinProps) {
  const isCoarsePointer = useMatchMedia("(pointer: coarse)");
  const [entered, setEntered] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [activating, setActivating] = useState(false);
  const rootRef = useRef<HTMLButtonElement>(null);
  const icon = PIN_ICONS[scenarioId];

  const tooltipOpen = entered && (hovered || activating);

  useEffect(() => {
    if (!active) {
      setEntered(false);
      setHovered(false);
      return;
    }

    const enterTimer = window.setTimeout(() => {
      setEntered(true);
    }, entranceDelayMs);

    return () => {
      window.clearTimeout(enterTimer);
    };
  }, [active, entranceDelayMs]);

  const activate = useCallback(() => {
    setActivating(true);
    onActivate(scenarioId);
    window.setTimeout(() => setActivating(false), 520);
  }, [onActivate, scenarioId]);

  const handleClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      if (!entered) {
        e.preventDefault();
        return;
      }
      if (isCoarsePointer && !tooltipOpen) {
        e.preventDefault();
        setHovered(true);
        return;
      }
      activate();
    },
    [activate, entered, isCoarsePointer, tooltipOpen],
  );

  useEffect(() => {
    if (!hovered) return;
    const onDocPointer = (ev: PointerEvent) => {
      if (!rootRef.current?.contains(ev.target as Node)) {
        setHovered(false);
      }
    };
    document.addEventListener("pointerdown", onDocPointer);
    return () => document.removeEventListener("pointerdown", onDocPointer);
  }, [hovered]);

  return (
    <button
      ref={rootRef}
      type="button"
      data-request={scenarioId}
      className={`hero-request-pin hero-request-pin--${align}${entered ? " is-entered" : ""}${tooltipOpen ? " is-tooltip-open" : ""}${activating ? " is-activating" : ""}`}
      style={{ left, top }}
      onClick={handleClick}
      onPointerEnter={() => {
        if (!entered) return;
        setHovered(true);
      }}
      onPointerLeave={() => {
        setHovered(false);
      }}
      onFocus={() => {
        if (!entered) return;
        setHovered(true);
      }}
      onBlur={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node)) {
          setHovered(false);
        }
      }}
      aria-label={`${question} Tap to see the reply on the phone demo.`}
      tabIndex={entered ? 0 : -1}
    >
      <span className="hero-request-pin__beacon" aria-hidden>
        <span className="hero-request-pin__beam" />
        <span className="hero-request-pin__dot">
          {icon ? (
            <Image
              src={icon.src}
              alt={icon.alt}
              width={16}
              height={16}
              className="hero-request-pin__icon-img"
              draggable={false}
            />
          ) : null}
        </span>
      </span>

      <span className="hero-request-pin__tooltip" role="tooltip" aria-hidden={!tooltipOpen}>
        <span className="hero-request-pin__question">{question}</span>
        <span className="hero-request-pin__reply">click to reply</span>
      </span>
    </button>
  );
}
