"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { DemoQueueItem, DemoReviewGuest } from "@/lib/solutions";
import { SOLUTIONS } from "@/lib/solutions";

export type DemoChatRole = "user" | "assistant";

export type DemoChatMessage = {
  id: string;
  role: DemoChatRole;
  body: string;
  time: string;
};

export type DemoSuggestion = {
  id: string;
  label: string;
};

const nowTime = () =>
  new Date().toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

const OPS_BASE: DemoQueueItem[] =
  SOLUTIONS.find((s) => s.id === "ops")?.demo.queue?.slice() ?? [];

const REVIEW_GUESTS_BASE: DemoReviewGuest[] =
  SOLUTIONS.find((s) => s.id === "reviews")?.demo.guests?.slice() ?? [];

const GUEST_INTRO =
  "Hello! I'm Mage, your hotel assistant. I can help with room service, amenities, local recommendations, or any questions about your stay. What can I do for you? Do you require any further assistance? (Yes / No)";

const GUEST_WIFI_REPLY =
  "The WiFi network is 'HotelGuest' and the password is on the card in your room. Let me know if you have any trouble connecting! Do you require any further assistance? (Yes / No)";

const GUEST_LATE_REPLY =
  "You can request 1:00 PM checkout based on availability. I've created a front-desk follow-up so the team can confirm shortly. Do you require any further assistance? (Yes / No)";

const GUEST_PARK_REPLY =
  "Overnight parking is in Garage B, levels 2 to 4. Show your room key at entry for guest validation. Do you require any further assistance? (Yes / No)";

const GUEST_CLOSING_YES = "Wonderful — if anything else comes up, just ask. Enjoy your stay!";
const GUEST_CLOSING_NO = "All set. Have a great stay!";

const LATE_CHECKOUT_TASK: DemoQueueItem = {
  id: "demo-late-checkout",
  title: "Guest — late checkout request",
  location: "Front Desk",
  priority: "medium",
  eta: "Pending",
};

type GuestPhase =
  | "idle"
  | "after_hi"
  | "after_topic"
  | "after_followup_yes"
  | "after_followup_no";

type ReviewPhase = "idle" | "after_intro" | "after_send";

type DemoSimulationValue = {
  guestMessages: DemoChatMessage[];
  guestSuggestions: DemoSuggestion[];
  guestPhase: GuestPhase;
  guestAppend: (role: DemoChatMessage["role"], body: string) => void;
  guestPickSuggestion: (id: string) => void;
  resetGuestDemo: () => void;

  opsExtraQueue: DemoQueueItem[];
  resetOpsExtras: () => void;

  reviewMessages: DemoChatMessage[];
  reviewSuggestions: DemoSuggestion[];
  reviewPhase: ReviewPhase;
  reviewGuests: DemoReviewGuest[];
  reviewActiveGuestId: string;
  reviewInviteSentForId: string | null;
  reviewPickSuggestion: (id: string) => void;
  reviewSetActiveGuest: (id: string) => void;
  resetReviewDemo: () => void;

  resetAllDemos: () => void;
};

const DemoSimulationContext = createContext<DemoSimulationValue | null>(null);

const initialGuestSuggestions: DemoSuggestion[] = [{ id: "hi", label: "Hi" }];

export function DemoSimulationProvider({ children }: { children: ReactNode }) {
  const [guestMessages, setGuestMessages] = useState<DemoChatMessage[]>([]);
  const [guestPhase, setGuestPhase] = useState<GuestPhase>("idle");
  const [guestTopicPendingFollowup, setGuestTopicPendingFollowup] = useState(false);

  const [opsExtraQueue, setOpsExtraQueue] = useState<DemoQueueItem[]>([]);

  const [reviewMessages, setReviewMessages] = useState<DemoChatMessage[]>([]);
  const [reviewPhase, setReviewPhase] = useState<ReviewPhase>("idle");
  const [reviewGuests, setReviewGuests] = useState<DemoReviewGuest[]>(REVIEW_GUESTS_BASE);
  const [reviewActiveGuestId, setReviewActiveGuestId] = useState(REVIEW_GUESTS_BASE[0]?.id ?? "g1");
  const [reviewInviteSentForId, setReviewInviteSentForId] = useState<string | null>(null);

  const guestAppend = useCallback((role: DemoChatMessage["role"], body: string) => {
    setGuestMessages((prev) => [...prev, { id: uid(), role, body, time: nowTime() }]);
  }, []);

  const resetGuestDemo = useCallback(() => {
    setGuestMessages([]);
    setGuestPhase("idle");
    setGuestTopicPendingFollowup(false);
    setOpsExtraQueue((extras) => extras.filter((t) => t.id !== LATE_CHECKOUT_TASK.id));
  }, []);

  const resetOpsExtras = useCallback(() => {
    setOpsExtraQueue([]);
  }, []);

  const resetReviewDemo = useCallback(() => {
    setReviewMessages([]);
    setReviewPhase("idle");
    setReviewGuests(REVIEW_GUESTS_BASE);
    setReviewActiveGuestId(REVIEW_GUESTS_BASE[0]?.id ?? "g1");
    setReviewInviteSentForId(null);
  }, []);

  const resetAllDemos = useCallback(() => {
    resetGuestDemo();
    resetOpsExtras();
    resetReviewDemo();
  }, [resetGuestDemo, resetOpsExtras, resetReviewDemo]);

  const reviewAppend = useCallback((role: DemoChatMessage["role"], body: string) => {
    setReviewMessages((prev) => [...prev, { id: uid(), role, body, time: nowTime() }]);
  }, []);

  const guestPickSuggestion = useCallback(
    (id: string) => {
      if (id === "hi") {
        guestAppend("user", "Hi");
        window.setTimeout(() => {
          guestAppend("assistant", GUEST_INTRO);
          setGuestPhase("after_hi");
          setGuestTopicPendingFollowup(false);
        }, 320);
        return;
      }

      if (guestPhase === "after_hi" && (id === "wifi" || id === "late" || id === "park")) {
        const userText =
          id === "wifi"
            ? "I can't find the wi-fi password."
            : id === "late"
              ? "Can I get a late checkout?"
              : "Where should I park overnight?";
        guestAppend("user", userText);
        window.setTimeout(() => {
          if (id === "wifi") guestAppend("assistant", GUEST_WIFI_REPLY);
          else if (id === "late") {
            guestAppend("assistant", GUEST_LATE_REPLY);
            setOpsExtraQueue((prev) =>
              prev.some((t) => t.id === LATE_CHECKOUT_TASK.id) ? prev : [...prev, LATE_CHECKOUT_TASK],
            );
          } else guestAppend("assistant", GUEST_PARK_REPLY);
          setGuestPhase("after_topic");
          setGuestTopicPendingFollowup(true);
        }, 380);
        return;
      }

      if (guestTopicPendingFollowup && (id === "yes" || id === "no")) {
        guestAppend("user", id === "yes" ? "Yes" : "No");
        window.setTimeout(() => {
          guestAppend("assistant", id === "yes" ? GUEST_CLOSING_YES : GUEST_CLOSING_NO);
          setGuestPhase(id === "yes" ? "after_followup_yes" : "after_followup_no");
          setGuestTopicPendingFollowup(false);
        }, 320);
        return;
      }
    },
    [guestAppend, guestPhase, guestTopicPendingFollowup],
  );

  const reviewPickSuggestion = useCallback(
    (id: string) => {
      if (id === "start") {
        setReviewMessages([]);
        setReviewInviteSentForId(null);
        setReviewPhase("after_intro");
        setReviewMessages([
          {
            id: uid(),
            role: "assistant",
            body: "Maya R. just finished a high-sentiment chat on Guest Expert. Ready to send a review invite with Google and Tripadvisor links?",
            time: nowTime(),
          },
        ]);
        return;
      }
      if (reviewPhase === "after_intro" && id === "send") {
        reviewAppend("user", "Send review invite");
        window.setTimeout(() => {
          reviewAppend(
            "assistant",
            "Queued — Maya will receive SMS and email with both links. Tracking opens in Review Specialist.",
          );
          setReviewPhase("after_send");
          setReviewInviteSentForId("g1");
          setReviewActiveGuestId("g1");
          setReviewGuests((prev) =>
            prev.map((g) => (g.id === "g1" ? { ...g, signal: "Review invite sent · tracking opens" } : g)),
          );
        }, 400);
        return;
      }
      if (reviewPhase === "after_intro" && id === "snooze") {
        reviewAppend("user", "Snooze 24 hours");
        window.setTimeout(() => {
          reviewAppend("assistant", "Snoozed. I'll surface Maya again tomorrow unless another signal arrives.");
          setReviewPhase("after_send");
        }, 380);
        return;
      }
      if (reviewPhase === "after_intro" && id === "summary") {
        reviewAppend("user", "Show summary");
        window.setTimeout(() => {
          reviewAppend(
            "assistant",
            "Summary: resolved checkout request, thanked staff twice, sentiment score 92. Recommend invite when convenient.",
          );
          setReviewPhase("after_intro");
        }, 380);
        return;
      }
    },
    [reviewAppend, reviewPhase],
  );

  const guestSuggestions = useMemo(() => {
    if (guestPhase === "idle") return initialGuestSuggestions;
    if (guestPhase === "after_hi") {
      return [
        { id: "wifi", label: "I can't find the wi-fi password." },
        { id: "late", label: "Can I get a late checkout?" },
        { id: "park", label: "Where should I park overnight?" },
      ];
    }
    if (guestTopicPendingFollowup) {
      return [
        { id: "yes", label: "Yes" },
        { id: "no", label: "No" },
      ];
    }
    if (guestPhase === "after_followup_yes" || guestPhase === "after_followup_no") {
      return [{ id: "restart", label: "Restart conversation" }];
    }
    return [];
  }, [guestPhase, guestTopicPendingFollowup]);

  const guestPickSuggestionWrapped = useCallback(
    (id: string) => {
      if (id === "restart") {
        resetGuestDemo();
        return;
      }
      guestPickSuggestion(id);
    },
    [guestPickSuggestion, resetGuestDemo],
  );

  const reviewSuggestions = useMemo(() => {
    if (reviewPhase === "idle") {
      return [{ id: "start", label: "Preview outreach" }];
    }
    if (reviewPhase === "after_intro") {
      return [
        { id: "send", label: "Send review invite" },
        { id: "snooze", label: "Snooze 24 hours" },
        { id: "summary", label: "Show summary" },
      ];
    }
    if (reviewPhase === "after_send") {
      return [{ id: "restart", label: "Reset review demo" }];
    }
    return [];
  }, [reviewPhase]);

  const reviewPickWrapped = useCallback(
    (id: string) => {
      if (id === "restart") {
        resetReviewDemo();
        return;
      }
      reviewPickSuggestion(id);
    },
    [resetReviewDemo, reviewPickSuggestion],
  );

  const reviewSetActiveGuest = useCallback((id: string) => {
    setReviewActiveGuestId(id);
  }, []);

  const value = useMemo<DemoSimulationValue>(
    () => ({
      guestMessages,
      guestSuggestions,
      guestPhase,
      guestAppend,
      guestPickSuggestion: guestPickSuggestionWrapped,
      resetGuestDemo,
      opsExtraQueue,
      resetOpsExtras,
      reviewMessages,
      reviewSuggestions,
      reviewPhase,
      reviewGuests,
      reviewActiveGuestId,
      reviewInviteSentForId,
      reviewPickSuggestion: reviewPickWrapped,
      reviewSetActiveGuest,
      resetReviewDemo,
      resetAllDemos,
    }),
    [
      guestAppend,
      guestMessages,
      guestPhase,
      guestPickSuggestionWrapped,
      guestSuggestions,
      opsExtraQueue,
      resetAllDemos,
      resetGuestDemo,
      resetOpsExtras,
      resetReviewDemo,
      reviewActiveGuestId,
      reviewGuests,
      reviewInviteSentForId,
      reviewMessages,
      reviewPhase,
      reviewPickWrapped,
      reviewSetActiveGuest,
      reviewSuggestions,
    ],
  );

  return <DemoSimulationContext.Provider value={value}>{children}</DemoSimulationContext.Provider>;
}

export function useDemoSimulation() {
  const ctx = useContext(DemoSimulationContext);
  if (!ctx) {
    throw new Error("useDemoSimulation must be used within DemoSimulationProvider");
  }
  return ctx;
}

export function useDemoSimulationOptional() {
  return useContext(DemoSimulationContext);
}

export { OPS_BASE as DEMO_OPS_BASE_QUEUE };
