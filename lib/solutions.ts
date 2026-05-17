export type SolutionKind = "guest" | "ops" | "reviews" | "manager";

export type DemoAction = {
  id: string;
  label: string;
  response: string;
  meta?: string;
};

export type OpsTaskStatus = "todo" | "assigned" | "doing" | "done";

export type DemoQueueItem = {
  id: string;
  title: string;
  location: string;
  priority: "low" | "medium" | "high";
  eta: string;
  status: OpsTaskStatus;
  note?: string;
};

export type DemoReviewGuest = {
  id: string;
  name: string;
  signal: string;
  score: number;
};

export type DemoTopic = {
  id: string;
  title: string;
  answer: string;
};

export type SolutionDefinition = {
  id: SolutionKind;
  anchor: string;
  heading: string;
  summary: string;
  phoneImage?: string;
  demo: {
    title: string;
    /** Unused; shell height follows content. Kept for optional future use. */
    aspectRatio?: number;
    actions?: DemoAction[];
    queue?: DemoQueueItem[];
    guests?: DemoReviewGuest[];
    topics?: DemoTopic[];
  };
};

export const SOLUTIONS: SolutionDefinition[] = [
  {
    id: "guest",
    anchor: "guest-expert",
    heading: "Guest Expert",
    summary:
      "Talk to every guest, track every task, and answer every question—perfectly, every time.",
    phoneImage: "/teammates/ai-manager.png",
    demo: {
      title: "Guest chat",
      actions: [
        {
          id: "wifi",
          label: "What is the Wi-Fi password?",
          response:
            "Wi-Fi is `RiversideGuest` and the password is `Welcome2026`. You can also find this in your room QR guide.",
          meta: "Answered in 8s",
        },
        {
          id: "late-checkout",
          label: "Can I get a late checkout?",
          response:
            "You can request 1:00 PM checkout based on availability. I created a front-desk follow-up so the team can confirm shortly.",
          meta: "Task created",
        },
        {
          id: "parking",
          label: "Where should I park overnight?",
          response:
            "Overnight parking is in Garage B, levels 2 to 4. Show your room key at entry for guest validation.",
          meta: "Knowledge base",
        },
      ],
    },
  },
  {
    id: "ops",
    anchor: "ops-lead",
    heading: "Ops Lead",
    summary:
      "Turn every guest request into a routed, assigned task with live status across shifts, surface Guest Expert follow-ups at the top of the queue in real time, and spot bottlenecks before they become service issues.",
    demo: {
      title: "Task board",
      queue: [
        {
          id: "q1",
          title: "Room 704 - extra towels",
          location: "Housekeeping",
          priority: "medium",
          eta: "12 min",
          status: "todo",
          note: "Deliver four bath towels before turndown.",
        },
        {
          id: "q2",
          title: "Room 315 - AC not cooling",
          location: "Maintenance",
          priority: "high",
          eta: "8 min",
          status: "doing",
          note: "Thermostat stuck at 74°F; filter check in progress.",
        },
        {
          id: "q3",
          title: "Lobby - luggage hold follow-up",
          location: "Front Desk",
          priority: "low",
          eta: "18 min",
          status: "assigned",
          note: "Guest returns at 4 PM — tags at bell desk.",
        },
        {
          id: "q4",
          title: "Room 512 - minibar restock",
          location: "Housekeeping",
          priority: "low",
          eta: "Done",
          status: "done",
          note: "Completed before 10 AM shift handoff.",
        },
      ],
    },
  },
  {
    id: "manager",
    anchor: "help-desk",
    heading: "Help Desk",
    summary:
      "Set up your property’s documentation once — LOJJ uses it to train the AI, publish a staff help page, and answer shift questions in the side panel so everyone works from the same source of truth.",
    demo: {
      title: "Help desk",
      topics: [
        {
          id: "t1",
          title: "How do we process an early-arrival bag hold?",
          answer:
            "Tag each bag with room or phone number, place it in rack zone C, and mark the task complete in Ops Lead for handoff visibility.",
        },
        {
          id: "t2",
          title: "What is our escalation policy for room moves?",
          answer:
            "Room moves are approved by duty manager after one attempted fix. Log the issue, assign Maintenance, then notify front desk with the updated room.",
        },
        {
          id: "t3",
          title: "What if a guest asks for invoice corrections?",
          answer:
            "Collect the correction details, open a billing follow-up task, and share expected callback time before ending the interaction.",
        },
      ],
    },
  },
  {
    id: "reviews",
    anchor: "review-specialist",
    heading: "Review Specialist",
    summary:
      "Score every guest touchpoint for review likelihood across Google, TripAdvisor, Hotels.com, Expedia, and Booking.com — then route high-intent stays through LOJJ so five-star drafts land on the right platform at the right moment.",
    demo: {
      title: "Review routing",
      guests: [
        { id: "g1", name: "Maya R.", signal: "Resolved checkout request", score: 92 },
        { id: "g2", name: "Daniel K.", signal: "Praised concierge speed", score: 88 },
        { id: "g3", name: "Amina T.", signal: "Shared positive feedback", score: 95 },
      ],
    },
  },
];
