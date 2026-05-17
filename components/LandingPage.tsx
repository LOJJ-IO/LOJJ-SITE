"use client";

import { useCallback, useEffect, useState } from "react";

import LandingMarkup from "./LandingMarkup";
import LoadingOverlay from "./LoadingOverlay";
import { WaitlistProvider } from "./WaitlistDialog";

export default function LandingPage() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [doorsOpen, setDoorsOpen] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true);

  const handleLoadProgress = useCallback((pct: number) => {
    setLoadingProgress((prev) => {
      const next = Math.min(100, Math.round(pct));
      return next > prev ? next : prev;
    });
  }, []);

  useEffect(() => {
    if (loadingProgress >= 100 && !doorsOpen) {
      setDoorsOpen(true);
    }
  }, [loadingProgress, doorsOpen]);

  const handleOverlayComplete = useCallback(() => {
    setOverlayVisible(false);
  }, []);

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    const scrollTop = () => window.scrollTo(0, 0);
    scrollTop();
    window.addEventListener("load", scrollTop);
    return () => window.removeEventListener("load", scrollTop);
  }, []);

  return (
    <WaitlistProvider>
      <div className="min-h-screen flex flex-col items-center relative">
        {overlayVisible && (
          <LoadingOverlay progress={loadingProgress} onComplete={handleOverlayComplete} />
        )}
        <LandingMarkup doorsOpen={doorsOpen} onLoadProgress={handleLoadProgress} />
      </div>
    </WaitlistProvider>
  );
}
