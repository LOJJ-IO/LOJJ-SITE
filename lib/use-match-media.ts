"use client";

import { useEffect, useState } from "react";

/** Matches a CSS media query; updates on resize. */
export function useMatchMedia(query: string, defaultValue = false): boolean {
  const [matches, setMatches] = useState(defaultValue);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const apply = () => setMatches(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [query]);

  return matches;
}

/** Guest Expert + solution sections use stacked copy-first layout below this width. */
export function useNarrowSolutionLayout(): boolean {
  return useMatchMedia("(width < 1030px)");
}

/** Desktop demo screenshots replace live inbox/kanban/help-desk at this width and below. */
export function useDemoMobileSnapshot(): boolean {
  return useMatchMedia("(width <= 768px)");
}
