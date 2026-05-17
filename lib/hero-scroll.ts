export const HERO_TOTAL_FRAMES = 214;

/** Frame index when hallway doors read as “fairly open” in the scrub sequence. */
export const HERO_DOORS_OPEN_FRAME = 100;

export const HERO_VISIBILITY_PROGRESS =
  HERO_DOORS_OPEN_FRAME / (HERO_TOTAL_FRAMES - 1);

/** Scroll progress where the first tagline begins its walk-through exit. */
export const HERO_TAGLINE_EXIT_START = 0.04;

export function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function heroTaglineExitT(progress: number): number {
  return clamp01(
    (progress - HERO_TAGLINE_EXIT_START) /
      (HERO_VISIBILITY_PROGRESS - HERO_TAGLINE_EXIT_START),
  );
}

export function heroVisibilityEntranceT(progress: number): number {
  const visStart = HERO_VISIBILITY_PROGRESS - 0.05;
  const visEnd = HERO_VISIBILITY_PROGRESS + 0.07;
  return clamp01((progress - visStart) / (visEnd - visStart));
}
