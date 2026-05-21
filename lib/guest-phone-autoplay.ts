export type GuestAutoplayPick = (id: string) => void;
export type GuestAutoplayReset = () => void;

/** Delays tuned for guestAppend + assistant reply timeouts (320–380ms). */
const STEP_MS = {
  hello: 400,
  late: 3600,
  no: 8200,
  cycleGap: 4000,
} as const;

/** Scripted demo loop for mobile (no suggestion chips). */
export function runGuestPhoneAutoplay(
  pick: GuestAutoplayPick,
  reset: GuestAutoplayReset,
): () => void {
  const timeouts: number[] = [];
  let cancelled = false;

  const schedule = (fn: () => void, ms: number) => {
    timeouts.push(window.setTimeout(fn, ms));
  };

  const runCycle = () => {
    if (cancelled) return;
    reset();
    schedule(() => pick("hello"), STEP_MS.hello);
    schedule(() => pick("late"), STEP_MS.late);
    schedule(() => pick("no"), STEP_MS.no);
    schedule(() => runCycle(), STEP_MS.hello + STEP_MS.no + STEP_MS.cycleGap);
  };

  runCycle();

  return () => {
    cancelled = true;
    for (const id of timeouts) window.clearTimeout(id);
  };
}
