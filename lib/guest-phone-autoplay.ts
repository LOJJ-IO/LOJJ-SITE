export type GuestAutoplayPick = (id: string) => void;

/** Matches intro typing sequence in `GuestPhone` (650 + 380 + 950 ms). */
export const GUEST_PHONE_INTRO_READY_MS = 2100;

/** Default scripted demo: late checkout → decline → review prompt side effects. */
const DEFAULT_SCENARIO = [
  { pick: "late" as const, at: GUEST_PHONE_INTRO_READY_MS },
  { pick: "no" as const, at: GUEST_PHONE_INTRO_READY_MS + 6800 },
];

/** Runs the default guest-phone scenario once (no suggestion chips required). */
export function runGuestPhoneAutoplay(pick: GuestAutoplayPick): () => void {
  const timeouts: number[] = [];
  let cancelled = false;

  for (const step of DEFAULT_SCENARIO) {
    timeouts.push(
      window.setTimeout(() => {
        if (!cancelled) pick(step.pick);
      }, step.at),
    );
  }

  return () => {
    cancelled = true;
    for (const id of timeouts) window.clearTimeout(id);
  };
}
