"use client";

import { useCallback, useEffect, useState } from "react";
import { submitWaitlistForm } from "@/lib/waitlistSubmit";

import LandingMarkup from "./LandingMarkup";
import LoadingOverlay from "./LoadingOverlay";

export default function LandingPage() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [doorsOpen, setDoorsOpen] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true);

  // Called by ScrollCanvas as frames load
  const handleLoadProgress = useCallback((pct: number) => {
    setLoadingProgress((prev) => {
      // Only move forward, never backward
      const next = Math.min(100, Math.round(pct));
      return next > prev ? next : prev;
    });
  }, []);

  // Once all frames are loaded, open the doors
  useEffect(() => {
    if (loadingProgress >= 100 && !doorsOpen) {
      setDoorsOpen(true);
    }
  }, [loadingProgress, doorsOpen]);

  // Called by LoadingOverlay after door animation completes
  const handleOverlayComplete = useCallback(() => {
    setOverlayVisible(false);
  }, []);

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    if (window.location.hash) {
      history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }
    const scrollTop = () => window.scrollTo(0, 0);
    scrollTop();
    window.addEventListener("load", scrollTop);

    const footerForm = document.getElementById("footer-signup") as HTMLFormElement | null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const tooltipTimeouts: number[] = [];

    const clearAllTooltips = () => {
      tooltipTimeouts.forEach((t) => clearTimeout(t));
      tooltipTimeouts.length = 0;
      footerForm?.querySelectorAll(".form-tooltip").forEach((tip) => {
        tip.classList.remove("visible");
      });
    };

    const onSubmit = async (e: Event) => {
      if (!footerForm) return;
      clearAllTooltips();
      const inputs = footerForm.querySelectorAll(".newsletter-input");
      let hasError = false;
      let firstError: HTMLInputElement | undefined;

      inputs.forEach((input) => {
        const el = input as HTMLInputElement;
        const wrapper = el.closest(".newsletter-form");
        const tooltip = wrapper?.querySelector(".form-tooltip");
        if (!tooltip) return;

        let invalid = false;
        if (!el.value.trim()) {
          invalid = true;
        } else if (el.type === "email" && !emailRegex.test(el.value.trim())) {
          invalid = true;
          tooltip.textContent = "Please enter a valid email";
        }

        if (invalid) {
          hasError = true;
          firstError ??= el;
          tooltip.classList.add("visible");
          const t = window.setTimeout(() => tooltip.classList.remove("visible"), 3000);
          tooltipTimeouts.push(t);
        }
      });

      if (hasError) {
        e.preventDefault();
        if (firstError) firstError.focus();
      } else {
        e.preventDefault();
        const btn = footerForm.querySelector(".newsletter-btn") as HTMLButtonElement | null;
        if (btn) {
          btn.disabled = true;
          btn.textContent = "Sending...";
        }
        try {
          await submitWaitlistForm(footerForm);
          if (btn) btn.textContent = "Submitted";
          const t = window.setTimeout(() => {
            footerForm.reset();
            if (btn) {
              btn.textContent = "OK";
              btn.disabled = false;
            }
          }, 2400);
          tooltipTimeouts.push(t);
        } catch {
          if (btn) {
            btn.textContent = "Try again";
            btn.disabled = false;
          }
        }
      }
    };

    footerForm?.addEventListener("submit", onSubmit);

    const formInputs = footerForm
      ? (Array.from(footerForm.querySelectorAll(".newsletter-input")) as HTMLInputElement[])
      : [];

    const onInput = (ev: Event) => {
      const input = ev.target as HTMLInputElement;
      const wrapper = input.closest(".newsletter-form");
      const tooltip = wrapper?.querySelector(".form-tooltip");
      tooltip?.classList.remove("visible");
    };

    const onKeydown = (e: KeyboardEvent) => {
      const input = e.target as HTMLInputElement;
      const idx = formInputs.indexOf(input);
      if (e.key === "ArrowDown" || (e.key === "Tab" && !e.shiftKey)) {
        if (idx < formInputs.length - 1) {
          e.preventDefault();
          formInputs[idx + 1]?.focus();
        }
      } else if (e.key === "ArrowUp" || (e.key === "Tab" && e.shiftKey)) {
        if (idx > 0) {
          e.preventDefault();
          formInputs[idx - 1]?.focus();
        }
      }
    };

    formInputs.forEach((input) => {
      input.addEventListener("input", onInput);
      input.addEventListener("keydown", onKeydown);
    });

    return () => {
      window.removeEventListener("load", scrollTop);
      footerForm?.removeEventListener("submit", onSubmit);
      formInputs.forEach((input) => {
        input.removeEventListener("input", onInput);
        input.removeEventListener("keydown", onKeydown);
      });
      clearAllTooltips();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center relative">
      {overlayVisible && (
        <LoadingOverlay
          progress={loadingProgress}
          onComplete={handleOverlayComplete}
        />
      )}
      <LandingMarkup
        doorsOpen={doorsOpen}
        onLoadProgress={handleLoadProgress}
      />
    </div>
  );
}
