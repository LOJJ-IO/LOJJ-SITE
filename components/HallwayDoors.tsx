"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ReactElement } from "react";
import { useLayoutEffect, useRef } from "react";
import "./hallway-doors.css";

export const DOOR_STEPS = [
  {
    num: "01",
    title: "Guest Request",
    subtitle: "Capture the request and the context",
    label: "Guest Request",
    icon: "request" as const,
  },
  {
    num: "02",
    title: "Task Assignment",
    subtitle: "Send it to the right person",
    label: "Task Assignment",
    icon: "assignment" as const,
  },
  {
    num: "03",
    title: "Team Collaboration",
    subtitle: "Keep notes and handoffs clear",
    label: "Team Collaboration",
    icon: "collaboration" as const,
  },
  {
    num: "04",
    title: "Track Progress",
    subtitle: "See what's stuck and what's next",
    label: "Track Progress",
    icon: "progress" as const,
  },
  {
    num: "05",
    title: "Task Completion",
    subtitle: "Confirm it's done and done right",
    label: "Completion",
    icon: "completion" as const,
  },
  {
    num: "06",
    title: "Better Reviews",
    subtitle: "Deliver results guests notice",
    label: "Better Reviews",
    icon: "reviews" as const,
  },
];

function DoorIcon({ name }: { name: (typeof DOOR_STEPS)[number]["icon"] }) {
  const icons: Record<(typeof DOOR_STEPS)[number]["icon"], ReactElement> = {
    request: (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M5 3h10l4 4v14H5V3zm9 1.5V8h3.5L14 4.5zM8 11h8v2H8v-2zm0 4h8v2H8v-2z" />
      </svg>
    ),
    assignment: (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M7 4h10v16H7V4zm2 3h6v2H9V7zm0 4h6v2H9v-2zm0 4h4v2H9v-2z" />
      </svg>
    ),
    collaboration: (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M7 7a3 3 0 1 1 0 6a3 3 0 0 1 0-6zm10 0a3 3 0 1 1 0 6a3 3 0 0 1 0-6zM3 19c0-2.5 2.1-4.5 4.7-4.5c1.8 0 3.3.7 4.3 1.9c1-1.2 2.5-1.9 4.3-1.9c2.6 0 4.7 2 4.7 4.5v1H3v-1z" />
      </svg>
    ),
    progress: (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M5 19h2V9H5v10zm6 0h2V5h-2v14zm6 0h2v-7h-2v7z" />
      </svg>
    ),
    completion: (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M9.3 16.6L4.7 12l1.4-1.4l3.2 3.2l8.6-8.6l1.4 1.4l-10 10z" />
      </svg>
    ),
    reviews: (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M12 2l2.4 5.1L20 8l-4 3.9l1 5.6L12 15l-5 2.5l1-5.6L4 8l5.6-.9L12 2z" />
      </svg>
    ),
  };
  return icons[name] ?? icons.request;
}

const INITIAL_CART_X = 43;
const CART_SRC_MOVING = "/concierge-cart-gif-clear.gif";
const CART_SRC_IDLE = "/concierge-cart-idle.png";
const FIRST_DOOR_OPEN_PROGRESS = 1 / DOOR_STEPS.length;

export default function HallwayDoors() {
  const bundleRef = useRef<HTMLDivElement>(null);
  const pinRootRef = useRef<HTMLDivElement>(null);
  const hallwayRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const cartImgRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    const bundle = bundleRef.current;
    const pinRoot = pinRootRef.current;
    const hallwayMaybe = hallwayRef.current;
    const cartMaybe = cartRef.current;
    const cartImgMaybe = cartImgRef.current;
    if (!bundle || !pinRoot || !hallwayMaybe || !cartMaybe || !cartImgMaybe) return;

    const hallwayEl = hallwayMaybe;
    const cartEl = cartMaybe;
    const cartImgEl = cartImgMaybe;
    const pinTarget =
      (bundle.closest(".visualization-pin-root") as HTMLElement | null) ?? pinRoot;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let movementIdleTimer: number | null = null;
    let lastMovingState: boolean | null = null;
    let movingPreloadImg: HTMLImageElement | null = null;
    let idlePreloadImg: HTMLImageElement | null = null;

    // Warm both sources so first GIF switch at scroll-start doesn't hitch.
    if (typeof window !== "undefined") {
      movingPreloadImg = new Image();
      movingPreloadImg.src = CART_SRC_MOVING;
      idlePreloadImg = new Image();
      idlePreloadImg.src = CART_SRC_IDLE;
    }

    function setCartMovingVisual(isMoving: boolean) {
      if (lastMovingState === isMoving) return;
      lastMovingState = isMoving;
      cartEl.classList.toggle("moving", isMoving);
      cartImgEl.src = isMoving ? CART_SRC_MOVING : CART_SRC_IDLE;
    }

    setCartMovingVisual(false);

    const frames = Array.from(hallwayEl.querySelectorAll<HTMLElement>(".landing-frame"));

    function clamp(n: number, min: number, max: number) {
      return Math.max(min, Math.min(max, n));
    }

    const MOVEMENT_IDLE_MS = 240;

    function noteCartMovement() {
      setCartMovingVisual(true);
      if (movementIdleTimer !== null) window.clearTimeout(movementIdleTimer);
      movementIdleTimer = window.setTimeout(() => {
        movementIdleTimer = null;
        setCartMovingVisual(false);
      }, MOVEMENT_IDLE_MS);
    }

    function doorCenterXWithinHallway(frameEl: HTMLElement) {
      const hallRect = hallwayEl.getBoundingClientRect();
      const frameRect = frameEl.getBoundingClientRect();
      const cartRect = cartEl.getBoundingClientRect();
      const center = frameRect.left - hallRect.left + frameRect.width / 2;
      const desired = center - cartRect.width / 2;
      return clamp(desired, 0, Math.max(0, hallRect.width - cartRect.width));
    }

    if (prefersReduced) {
      cartEl.style.transform = `translate3d(${INITIAL_CART_X}px, 0, 80px)`;
      return () => {
        if (movementIdleTimer !== null) window.clearTimeout(movementIdleTimer);
      };
    }

    const ctx = gsap.context((context) => {
      gsap.registerPlugin(ScrollTrigger);
      hallwayEl.classList.add("is-gsap-scroll");

      const doors = gsap.utils.toArray<HTMLElement>(".landing-frame .landing-door");

      function updateDoorVisualState() {
        let activeIndex = -1;
        let mostRecentRevealed = -1;

        doors.forEach((door, index) => {
          const frame = frames[index];
          if (!frame) return;
          const rotationY = Number(gsap.getProperty(door, "rotationY")) || 0;
          const isRevealed = rotationY <= -8;
          const isActive = rotationY <= -8 && rotationY > -82;

          frame.classList.toggle("is-revealed", isRevealed);
          frame.classList.toggle("is-active", isActive);

          if (isRevealed) mostRecentRevealed = index;
          if (isActive) activeIndex = index;
        });

        if (activeIndex === -1) {
          frames.forEach((frame, index) => {
            frame.classList.toggle(
              "is-active",
              index === mostRecentRevealed && mostRecentRevealed !== -1,
            );
          });
        }
      }

      gsap.set(cartEl, { x: INITIAL_CART_X, y: 0, z: 80, force3D: true });

      gsap.set(doors, {
        transformOrigin: "left center",
        transformPerspective: 900,
        rotationY: 0,
      });

      context.add(() => {
        hallwayEl.classList.remove("is-gsap-scroll");
        if (movementIdleTimer !== null) window.clearTimeout(movementIdleTimer);
        movingPreloadImg = null;
        idlePreloadImg = null;
      });

      let lastGsapCartX = INITIAL_CART_X;
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          /* Pin the full "How Requests Get Done" card so the box + hallway hold position together. */
          trigger: pinTarget,
          pin: pinTarget,
          /* Begin once section has settled into view (matches requested behavior). */
          start: "top 24%",
          /* Keep a meaningful scrub arc without creating excessive page stretch. */
          end: "+=1400",
          scrub: true,
          /* Pin via transforms inside the section to avoid reparent jump/disappear artifacts. */
          pinType: "fixed",
          pinReparent: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const x = gsap.getProperty(cartEl, "x") as number;
            const dx = x - lastGsapCartX;
            if (dx > 0.3) cartEl.classList.remove("facing-left");
            else if (dx < -0.3) cartEl.classList.add("facing-left");
            lastGsapCartX = x;

            // Keep idle visual until door 1 is fully opened.
            if (self.progress < FIRST_DOOR_OPEN_PROGRESS) {
              setCartMovingVisual(false);
              updateDoorVisualState();
              return;
            }

            // Drive GIF/idle image from actual cart movement while scrubbing.
            if (Math.abs(dx) > 0.08 || Math.abs(self.getVelocity()) > 6) {
              noteCartMovement();
            }
            updateDoorVisualState();
          },
        },
      });

      doors.forEach((door, i) => {
        const frame = frames[i];
        if (!frame) return;
        tl.to(cartEl, { x: () => doorCenterXWithinHallway(frame), duration: 1 }, "+=0");
        tl.to(door, { rotationY: -88, duration: 1 }, "<");
      });
      updateDoorVisualState();
    }, bundle);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={bundleRef} className="landing-hallway-cq w-full">
    <div className="landing-hallway-bundle relative z-10 w-full">
      {/* Steps row must stay ABOVE the pin target — otherwise GSAP’s pin-spacer pushes labels under ~100vh+ of scroll gap */}
      <div className="mb-2 md:mb-4 grid grid-cols-3 md:grid-cols-6 gap-y-2 md:gap-y-3 gap-x-1 md:gap-x-2 w-full max-w-6xl mx-auto px-1">
        {DOOR_STEPS.map((step, i) => (
          <div key={step.num} className="flex flex-col items-center text-center">
            <div className="text-white text-lg md:text-2xl font-bold mb-0.5 md:mb-1 opacity-80">{i + 1}</div>
            <div className="text-white text-[10px] sm:text-xs md:text-sm font-bold opacity-90 tracking-wide leading-tight whitespace-nowrap">
              {step.title}
            </div>
          </div>
        ))}
      </div>

      <div ref={pinRootRef} className="landing-hallway-pin-root w-full">
        <div className="landing-hallway-viewport">
          <div className="landing-hallway-viewport-center">
            <div className="landing-hallway-viewport-scale">
              <div ref={hallwayRef} className="landing-hallway">
                <div className="floor" aria-hidden />

                <div className="doors" aria-label="Workflow steps">
                  {DOOR_STEPS.map((step, index) => (
                    <div key={step.num} className="landing-frame" data-index={index}>
                      <div className="landing-doorway-interior" aria-hidden>
                        <div className="landing-interior-panel">
                          <p className="landing-interior-title">{step.title}</p>
                          <p className="landing-interior-subtitle">{step.subtitle}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="landing-door"
                        aria-label={`Door ${step.num}: ${step.title}`}
                      >
                        <span className="landing-handle" aria-hidden />
                        <span className="landing-door-badge" aria-hidden>
                          <span className="landing-door-num">{step.num}</span>
                          <span className="landing-door-icon">
                            <DoorIcon name={step.icon} />
                          </span>
                        </span>
                        <span className="landing-door-label">{step.label}</span>
                      </button>
                    </div>
                  ))}
                </div>

                <div ref={cartRef} className="landing-cart-wrapper">
                  <div className="landing-cart-bounce">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      ref={cartImgRef}
                      className="landing-cart-icon"
                      src={CART_SRC_IDLE}
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
