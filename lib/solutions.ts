export type SolutionKind = "guest" | "ops" | "reviews" | "manager";

export type DemoAction = {
  id: string;
  label: string;
  response: string;
  meta?: string;
};

export type DemoQueueItem = {
  id: string;
  title: string;
  location: string;
  priority: "low" | "medium" | "high";
  eta: string;
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
  kicker: string;
  heading: string;
  lede: string;
  bullets: string[];
  panelNote: string;
  phoneImage?: string;
  demo: {
    title: string;
    subtitle: string;
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
    kicker: "Solution 1",
    heading: "Guest Expert",
    lede: "Answer routine guest questions instantly so your front desk can stay present.",
    bullets: [
      "AI chat on your website and QR pages, always on.",
      "Answers in multiple languages with hotel-specific details.",
      "Escalates only when a real task is needed.",
    ],
    panelNote: "When a stay goes well, Guest Expert flags that moment for Review Specialist.",
    phoneImage: "/teammates/ai-manager.png",
    demo: {
      title: "Guest chat demo",
      subtitle: "Use the Mage phone or this pane — same script. Late checkout adds a live row in Ops Lead below.",
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
    kicker: "Solution 2",
    heading: "Ops Lead",
    lede: "Turn every guest request into a clear, assigned task with live status.",
    bullets: [
      "Routes tasks to housekeeping, maintenance, or front desk automatically.",
      "Keeps shift handoffs visible so work is not lost.",
      "Highlights bottlenecks before they become service issues.",
    ],
    panelNote: "Every assignment and status update stays visible across shifts.",
    demo: {
      title: "Task board demo",
      subtitle: "Ops preview: scripted Guest Expert follow-ups surface here at the top of the queue.",
      queue: [
        {
          id: "q1",
          title: "Room 704 - extra towels",
          location: "Housekeeping",
          priority: "medium",
          eta: "12 min",
        },
        {
          id: "q2",
          title: "Room 315 - AC not cooling",
          location: "Maintenance",
          priority: "high",
          eta: "8 min",
        },
        {
          id: "q3",
          title: "Lobby - luggage hold follow-up",
          location: "Front Desk",
          priority: "low",
          eta: "18 min",
        },
      ],
    },
  },
  {
    id: "reviews",
    anchor: "review-specialist",
    kicker: "Solution 3",
    heading: "Review Specialist",
    lede: "Invite happy guests to review at the right moment without bothering everyone.",
    bullets: [
      "Detects positive stay signals from guest conversations.",
      "Sends review requests with direct links when sentiment is high.",
      "Keeps outreach tasteful, timely, and measurable.",
    ],
    panelNote: "Triggered by Guest Expert when a conversation ends on a positive note.",
    phoneImage: "/teammates/review-specialist.png",
    demo: {
      title: "Review outreach demo",
      subtitle: "Phone + board stay in sync — send the scripted invite and watch Maya’s row update.",
      guests: [
        { id: "g1", name: "Maya R.", signal: "Resolved checkout request", score: 92 },
        { id: "g2", name: "Daniel K.", signal: "Praised concierge speed", score: 88 },
        { id: "g3", name: "Amina T.", signal: "Shared positive feedback", score: 95 },
      ],
    },
  },
  {
    id: "manager",
    anchor: "ai-manager",
    kicker: "Solution 4",
    heading: "AI Manager",
    lede: "Give new staff instant guidance so managers are interrupted less often.",
    bullets: [
      "Answers policy and process questions in seconds.",
      "Keeps responses consistent across every shift.",
      "Lets managers focus on exceptions, not repeat explanations.",
    ],
    panelNote: "A steady source of answers during rush hours and staffing gaps.",
    demo: {
      title: "Shift guidance demo",
      subtitle: "Pick a common new-staff question.",
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
];
