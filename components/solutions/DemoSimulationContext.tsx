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

export type DemoChatRole = "user" | "assistant" | "staff";

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

export type ReviewGuestScreen = "idle" | "inbox" | "compose" | "staff_request";

export type ReviewSentDemoEntry = {
  id: string;
  guestId: string;
  guestName: string;
  time: string;
  preview: string;
  kind: "staff_request" | "guest_submitted";
  /** Full submitted review text when kind is guest_submitted */
  reviewBody?: string;
};

const nowTime = () =>
  new Date().toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

const OPS_BASE: DemoQueueItem[] =
  SOLUTIONS.find((s) => s.id === "ops")?.demo.queue?.slice() ?? [];

const REVIEW_GUESTS_BASE: DemoReviewGuest[] =
  SOLUTIONS.find((s) => s.id === "reviews")?.demo.guests?.slice() ?? [];

function firstName(displayName: string) {
  return displayName.split(/\s+/)[0] ?? displayName;
}

const GUEST_INTRO =
  "Hello! I'm LOJJ, your hotel assistant. I can help with room service, amenities, local recommendations, or any questions about your stay. What can I do for you? Do you require any further assistance? (Yes / No)";

const GUEST_WIFI_REPLY =
  "The WiFi network is 'HotelGuest' and the password is on the card in your room. Let me know if you have any trouble connecting! Do you require any further assistance? (Yes / No)";

const GUEST_LATE_REPLY =
  "You can request 1:00 PM checkout based on availability. I've created a front-desk follow-up so the team can confirm shortly. Do you require any further assistance? (Yes / No)";

const GUEST_PARK_REPLY =
  "Overnight parking is in Garage B, levels 2 to 4. Show your room key at entry for guest validation. Do you require any further assistance? (Yes / No)";

const GUEST_YES_ACK =
  "Happy to help! What else can I look up for you?";

const GUEST_AFTER_NO_THANKS =
  "You're so welcome. If you have a moment, we'd love a quick review — it really helps the team. I've sent a note to your guest line and mirrored the request on Review Specialist.";

const REVIEW_GUEST_INBOUND =
  "Thanks again for staying with us! Tap Post review below to open a pre-filled 5-star draft when you're ready.";

export function guestReviewDraftBody(guestId: string) {
  const g = REVIEW_GUESTS_BASE.find((x) => x.id === guestId);
  const first = g?.name.split(/\s+/)[0] ?? "Guest";
  return `Wonderful stay — hi from ${first}! The team was friendly, the room was spotless, and check-in was smooth. Five stars all around!`;
}

const LATE_CHECKOUT_TASK: DemoQueueItem = {
  id: "demo-late-checkout",
  title: "Guest — late checkout request",
  location: "Front Desk",
  priority: "medium",
  eta: "Pending",
  status: "todo",
  note: "Guest Expert flagged a 1:00 PM checkout request.",
};

type GuestPhase = "idle" | "after_hi" | "after_topic" | "after_followup_no";

type ReviewComposeReturn = "inbox" | "staff_request";

type DemoSimulationValue = {
  guestMessages: DemoChatMessage[];
  guestSuggestions: DemoSuggestion[];
  guestPhase: GuestPhase;
  guestAppend: (role: DemoChatMessage["role"], body: string) => void;
  guestPickSuggestion: (id: string) => void;
  resetGuestDemo: () => void;

  guestJumpShowOps: boolean;
  guestJumpShowReviews: boolean;
  guestJumpShowManager: boolean;

  opsExtraQueue: DemoQueueItem[];
  resetOpsExtras: () => void;

  reviewGuests: DemoReviewGuest[];
  reviewActiveGuestId: string;
  reviewInviteSentForId: string | null;
  reviewGuestReviewSubmitted: boolean;
  reviewSetActiveGuest: (id: string) => void;
  resetReviewDemo: () => void;

  reviewGuestScreen: ReviewGuestScreen;
  reviewGuestMessages: DemoChatMessage[];
  reviewStaffRequestGuestId: string | null;
  reviewComposeGuestId: string;
  reviewComposeReturn: ReviewComposeReturn;
  reviewSentDemos: ReviewSentDemoEntry[];
  reviewGuestOpenCompose: () => void;
  reviewGuestBackFromCompose: () => void;
  reviewGuestSubmitReview: () => void;
  requestStaffReviewForGuest: (guestId: string) => void;
  reviewStaffClosePhone: () => void;

  resetAllDemos: () => void;
};

const DemoSimulationContext = createContext<DemoSimulationValue | null>(null);

const initialGuestSuggestions: DemoSuggestion[] = [{ id: "hello", label: "Hello" }];

function clearReviewGuestPhoneState(setters: {
  setReviewGuestScreen: (v: ReviewGuestScreen) => void;
  setReviewGuestMessages: (v: DemoChatMessage[]) => void;
  setReviewGuestReviewSubmitted: (v: boolean) => void;
  setReviewStaffRequestGuestId: (v: string | null) => void;
  setReviewComposeGuestId: (v: string) => void;
}) {
  setters.setReviewGuestScreen("idle");
  setters.setReviewGuestMessages([]);
  setters.setReviewGuestReviewSubmitted(false);
  setters.setReviewStaffRequestGuestId(null);
  setters.setReviewComposeGuestId("g1");
}

export function DemoSimulationProvider({ children }: { children: ReactNode }) {
  const [guestMessages, setGuestMessages] = useState<DemoChatMessage[]>([]);
  const [guestPhase, setGuestPhase] = useState<GuestPhase>("idle");
  const [guestTopicPendingFollowup, setGuestTopicPendingFollowup] = useState(false);
  const [guestManagerJumpUnlocked, setGuestManagerJumpUnlocked] = useState(false);
  const [guestTriggeredReviewFlow, setGuestTriggeredReviewFlow] = useState(false);

  const [opsExtraQueue, setOpsExtraQueue] = useState<DemoQueueItem[]>([]);

  const [reviewGuests, setReviewGuests] = useState<DemoReviewGuest[]>(REVIEW_GUESTS_BASE);
  const [reviewActiveGuestId, setReviewActiveGuestId] = useState(REVIEW_GUESTS_BASE[0]?.id ?? "g1");
  const [reviewInviteSentForId, setReviewInviteSentForId] = useState<string | null>(null);
  const [reviewGuestReviewSubmitted, setReviewGuestReviewSubmitted] = useState(false);

  const [reviewGuestScreen, setReviewGuestScreen] = useState<ReviewGuestScreen>("idle");
  const [reviewGuestMessages, setReviewGuestMessages] = useState<DemoChatMessage[]>([]);
  const [reviewStaffRequestGuestId, setReviewStaffRequestGuestId] = useState<string | null>(null);
  const [reviewComposeGuestId, setReviewComposeGuestId] = useState("g1");
  const [reviewComposeReturn, setReviewComposeReturn] = useState<ReviewComposeReturn>("inbox");
  const [reviewSentDemos, setReviewSentDemos] = useState<ReviewSentDemoEntry[]>([]);

  const guestAppend = useCallback((role: DemoChatMessage["role"], body: string) => {
    setGuestMessages((prev) => [...prev, { id: uid(), role, body, time: nowTime() }]);
  }, []);

  const resetGuestDemo = useCallback(() => {
    setGuestMessages([]);
    setGuestPhase("idle");
    setGuestTopicPendingFollowup(false);
    setGuestManagerJumpUnlocked(false);
    setGuestTriggeredReviewFlow(false);
    setOpsExtraQueue((extras) => extras.filter((t) => t.id !== LATE_CHECKOUT_TASK.id));
    clearReviewGuestPhoneState({
      setReviewGuestScreen,
      setReviewGuestMessages,
      setReviewGuestReviewSubmitted,
      setReviewStaffRequestGuestId,
      setReviewComposeGuestId,
    });
    setReviewComposeReturn("inbox");
    setReviewInviteSentForId(null);
    setReviewGuests(REVIEW_GUESTS_BASE);
    setReviewActiveGuestId(REVIEW_GUESTS_BASE[0]?.id ?? "g1");
  }, []);

  const resetOpsExtras = useCallback(() => {
    setOpsExtraQueue([]);
  }, []);

  const resetReviewDemo = useCallback(() => {
    clearReviewGuestPhoneState({
      setReviewGuestScreen,
      setReviewGuestMessages,
      setReviewGuestReviewSubmitted,
      setReviewStaffRequestGuestId,
      setReviewComposeGuestId,
    });
    setReviewComposeReturn("inbox");
    setReviewGuests(REVIEW_GUESTS_BASE);
    setReviewActiveGuestId(REVIEW_GUESTS_BASE[0]?.id ?? "g1");
    setReviewInviteSentForId(null);
    setReviewSentDemos([]);
  }, []);

  const resetAllDemos = useCallback(() => {
    resetGuestDemo();
    resetOpsExtras();
    resetReviewDemo();
  }, [resetGuestDemo, resetOpsExtras, resetReviewDemo]);

  const syncReviewFromGuestDecline = useCallback(() => {
    setReviewStaffRequestGuestId(null);
    setReviewGuestMessages([
      {
        id: uid(),
        role: "assistant",
        body: REVIEW_GUEST_INBOUND,
        time: nowTime(),
      },
    ]);
    setReviewGuestScreen("inbox");
    setReviewInviteSentForId("g1");
    setGuestTriggeredReviewFlow(true);
    setReviewActiveGuestId("g1");
    setReviewGuestReviewSubmitted(false);
    setReviewGuests((prev) =>
      prev.map((g) =>
        g.id === "g1"
          ? { ...g, signal: "Review prompt in guest chat · awaiting post" }
          : g,
      ),
    );
  }, []);

  const guestPickSuggestion = useCallback(
    (id: string) => {
      if (id === "hello") {
        guestAppend("user", "Hello");
        window.setTimeout(() => {
          guestAppend("assistant", GUEST_INTRO);
          setGuestPhase("after_hi");
          setGuestTopicPendingFollowup(false);
        }, 320);
        return;
      }

      if (guestPhase === "after_hi" && (id === "wifi" || id === "late" || id === "park")) {
        setGuestManagerJumpUnlocked(true);
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

      if (guestTopicPendingFollowup && id === "yes") {
        guestAppend("user", "Yes");
        window.setTimeout(() => {
          guestAppend("assistant", GUEST_YES_ACK);
          setGuestPhase("after_hi");
          setGuestTopicPendingFollowup(false);
        }, 320);
        return;
      }

      if (guestTopicPendingFollowup && id === "no") {
        guestAppend("user", "No, thanks for your help!");
        window.setTimeout(() => {
          guestAppend("assistant", GUEST_AFTER_NO_THANKS);
          setGuestPhase("after_followup_no");
          setGuestTopicPendingFollowup(false);
          syncReviewFromGuestDecline();
        }, 380);
        return;
      }
    },
    [guestAppend, guestPhase, guestTopicPendingFollowup, syncReviewFromGuestDecline],
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
    if (guestPhase === "after_followup_no") {
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

  const requestStaffReviewForGuest = useCallback((guestId: string) => {
    const guest = REVIEW_GUESTS_BASE.find((g) => g.id === guestId);
    if (!guest) return;
    const fn = firstName(guest.name);
    const body = `Hi ${fn}, thanks for staying with Riverside. Your visit made a real difference for our team — when you have a moment, we'd love a short public review. Tap Post review when you're ready.`;
    setReviewStaffRequestGuestId(guestId);
    setReviewGuestMessages([
      {
        id: uid(),
        role: "assistant",
        body,
        time: nowTime(),
      },
    ]);
    setReviewGuestScreen("staff_request");
    setReviewGuestReviewSubmitted(false);
    setReviewInviteSentForId(guestId);
    setReviewActiveGuestId(guestId);
    setReviewGuests((prev) =>
      prev.map((g) =>
        g.id === guestId ? { ...g, signal: "Staff review request · on guest phone" } : g,
      ),
    );
    setReviewSentDemos((prev) => [
      {
        id: uid(),
        guestId,
        guestName: guest.name,
        time: nowTime(),
        preview: body.slice(0, 120),
        kind: "staff_request",
      },
      ...prev,
    ]);
  }, []);

  const reviewStaffClosePhone = useCallback(() => {
    setReviewGuestScreen("idle");
    setReviewStaffRequestGuestId(null);
    setReviewGuestMessages([]);
    setReviewGuestReviewSubmitted(false);
    setReviewComposeGuestId("g1");
  }, []);

  const reviewGuestOpenCompose = useCallback(() => {
    const gid =
      reviewGuestScreen === "staff_request" && reviewStaffRequestGuestId
        ? reviewStaffRequestGuestId
        : reviewInviteSentForId || "g1";
    setReviewComposeGuestId(gid);
    setReviewComposeReturn(reviewGuestScreen === "staff_request" ? "staff_request" : "inbox");
    setReviewGuestScreen("compose");
  }, [reviewGuestScreen, reviewInviteSentForId, reviewStaffRequestGuestId]);

  const reviewGuestBackFromCompose = useCallback(() => {
    setReviewGuestScreen(reviewComposeReturn);
  }, [reviewComposeReturn]);

  const reviewGuestSubmitReview = useCallback(() => {
    const gid = reviewComposeGuestId;
    setReviewGuestReviewSubmitted(true);
    const guest = REVIEW_GUESTS_BASE.find((g) => g.id === gid);
    const label = guest?.name ?? "Guest";
    setReviewGuests((prev) =>
      prev.map((g) =>
        g.id === gid
          ? { ...g, signal: "5★ review posted · guest submitted" }
          : g,
      ),
    );
    const submittedText = guestReviewDraftBody(gid);
    setReviewSentDemos((prev) => [
      {
        id: uid(),
        guestId: gid,
        guestName: label,
        time: nowTime(),
        preview: submittedText.slice(0, 120),
        kind: "guest_submitted",
        reviewBody: submittedText,
      },
      ...prev,
    ]);
  }, [reviewComposeGuestId]);

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
      guestJumpShowOps: opsExtraQueue.length > 0,
      guestJumpShowReviews: guestTriggeredReviewFlow,
      guestJumpShowManager: guestManagerJumpUnlocked,
      opsExtraQueue,
      resetOpsExtras,
      reviewGuests,
      reviewActiveGuestId,
      reviewInviteSentForId,
      reviewGuestReviewSubmitted,
      reviewSetActiveGuest,
      resetReviewDemo,
      reviewGuestScreen,
      reviewGuestMessages,
      reviewStaffRequestGuestId,
      reviewComposeGuestId,
      reviewComposeReturn,
      reviewSentDemos,
      reviewGuestOpenCompose,
      reviewGuestBackFromCompose,
      reviewGuestSubmitReview,
      requestStaffReviewForGuest,
      reviewStaffClosePhone,
      resetAllDemos,
    }),
    [
      guestAppend,
      guestManagerJumpUnlocked,
      guestMessages,
      guestPhase,
      guestPickSuggestionWrapped,
      guestSuggestions,
      guestTriggeredReviewFlow,
      opsExtraQueue,
      requestStaffReviewForGuest,
      resetAllDemos,
      resetGuestDemo,
      resetOpsExtras,
      resetReviewDemo,
      reviewActiveGuestId,
      reviewComposeGuestId,
      reviewComposeReturn,
      reviewGuestBackFromCompose,
      reviewGuestMessages,
      reviewGuestOpenCompose,
      reviewGuestReviewSubmitted,
      reviewGuestScreen,
      reviewGuestSubmitReview,
      reviewGuests,
      reviewInviteSentForId,
      reviewSentDemos,
      reviewSetActiveGuest,
      reviewStaffClosePhone,
      reviewStaffRequestGuestId,
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
