"use client";

import { Badge } from "@heroui/react";
import { useEffect, useMemo, useRef, useState } from "react";

import DemoAvatar from "@/components/solutions/DemoAvatar";
import {
  IconArrowUp,
  IconInbox,
  IconMenu,
  IconPaperclip,
  IconSearch,
  IconSettings,
  IconSort,
  IconSparkles,
  IconUsers,
} from "@/components/solutions/demo-icons";
import {
  useDemoSimulation,
  type DemoChatMessage,
} from "@/components/solutions/DemoSimulationContext";
import { DEMO_GUESTS, LIVE_GUEST, guestById, guestLabel, type DemoGuestProfile } from "@/lib/demo-guests";

type InboxThread = {
  id: string;
  guestId: string;
  preview: string;
  time: string;
  staticMessages?: DemoChatMessage[];
};

const STATIC_THREADS: InboxThread[] = DEMO_GUESTS.filter((g) => g.id !== LIVE_GUEST.id).map(
  (guest) => {
    if (guest.id === "sarah") {
      return {
        id: guest.id,
        guestId: guest.id,
        preview: "Can we arrange a crib for tonight?",
        time: "Yesterday",
        staticMessages: [
          { id: "s1", role: "user", body: "Can we arrange a crib for tonight?", time: "9:14 AM" },
          {
            id: "s2",
            role: "assistant",
            body: "Absolutely — I've notified housekeeping for Room 305. A crib will be delivered within 30 minutes.",
            time: "9:15 AM",
          },
          {
            id: "s3",
            role: "staff",
            body: "Front desk here — housekeeping is on the way with the crib. They'll knock when it's outside your door.",
            time: "9:16 AM",
          },
        ],
      };
    }
    if (guest.id === "marcus") {
      return {
        id: guest.id,
        guestId: guest.id,
        preview: "Garage B works — thank you!",
        time: "Mon",
        staticMessages: [
          { id: "m1", role: "user", body: "Where should I park overnight?", time: "6:14 PM" },
          {
            id: "m2",
            role: "assistant",
            body: "Overnight parking is in Garage B, levels 2–4. Show your room key at entry for guest validation.",
            time: "6:14 PM",
          },
          { id: "m3", role: "user", body: "Garage B works — thank you!", time: "6:15 PM" },
        ],
      };
    }
    if (guest.id === "priya") {
      return {
        id: guest.id,
        guestId: guest.id,
        preview: "Pool towels at the cabana?",
        time: "Sun",
        staticMessages: [
          { id: "p1", role: "user", body: "What time does the pool close?", time: "4:40 PM" },
          {
            id: "p2",
            role: "assistant",
            body: "The pool is open 7 AM – 10 PM daily. Towels are at the cabana desk.",
            time: "4:40 PM",
          },
        ],
      };
    }
    return {
      id: guest.id,
      guestId: guest.id,
      preview: "Invoice copy for my company stay",
      time: "Sat",
      staticMessages: [
        { id: "d1", role: "user", body: "Can I get an invoice copy for my company stay?", time: "11:02 AM" },
        {
          id: "d2",
          role: "assistant",
          body: "Of course — I've sent a folio summary to the email on file and flagged front desk for a printed copy.",
          time: "11:03 AM",
        },
      ],
    };
  },
);

const LIST_WIDTH_DEFAULT = 220;
const LIST_WIDTH_MIN = 160;
const LIST_WIDTH_MAX_RATIO = 0.45;

const PREVIEW_STEPS: Pick<DemoChatMessage, "role" | "body">[] = [
  { role: "user", body: "Hello" },
  {
    role: "assistant",
    body: "Hello Alex! I'm LOJJ, your Riverside Hotel assistant. Ask about Wi‑Fi, checkout, parking, or anything about your stay in Room 412.",
  },
];

function roleLabel(role: DemoChatMessage["role"]) {
  if (role === "user") return LIVE_GUEST.name.split(" ")[0] ?? "Guest";
  if (role === "staff") return "Staff";
  return "LOJJ";
}

function ChatBubbles({
  messages,
  guest,
  scrollRef,
}: {
  messages: DemoChatMessage[];
  guest: DemoGuestProfile | undefined;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}) {
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, scrollRef]);

  return (
    <div ref={scrollRef} className="inbox-v2-chat-scroll demo-scroll-hidden" aria-live="polite">
      {messages.map((m) => {
        const isUser = m.role === "user";
        const isStaff = m.role === "staff";
        return (
          <div
            key={m.id}
            className={`inbox-v2-msg inbox-v2-msg--${isUser ? "guest" : isStaff ? "staff" : "assistant"}`}
          >
            {isUser && guest ? <DemoAvatar guest={guest} size="sm" className="inbox-v2-msg-avatar-ui" /> : null}
            <div className="inbox-v2-msg-content">
              <span className="inbox-v2-msg-role">{roleLabel(m.role)}</span>
              <div
                className={`inbox-v2-bubble inbox-v2-bubble--${
                  isUser ? "guest" : isStaff ? "staff" : "assistant"
                }`}
              >
                <p>{m.body}</p>
              </div>
              <span className="inbox-v2-msg-time">{m.time}</span>
            </div>
            {!isUser ? (
              <DemoAvatar
                name={isStaff ? "Staff" : "LOJJ"}
                initials={isStaff ? "SW" : "L"}
                size="sm"
                className="inbox-v2-msg-avatar-ui"
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function NavIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="inbox-v2-nav-icon" aria-hidden>
      {children}
    </span>
  );
}

export default function GuestInboxDesktopDemo() {
  const { guestMessages, guestAppend } = useDemoSimulation();
  const splitRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string>("live");
  const [previewCount, setPreviewCount] = useState(0);
  const [listWidthPx, setListWidthPx] = useState<number | null>(null);
  const [staffDraft, setStaffDraft] = useState("");

  const liveMessages = guestMessages;
  const usingLive = liveMessages.length > 0;

  useEffect(() => {
    if (usingLive) {
      setPreviewCount(0);
      return;
    }
    setPreviewCount(0);
    const timers: number[] = [];
    PREVIEW_STEPS.forEach((_, i) => {
      timers.push(
        window.setTimeout(() => {
          setPreviewCount(i + 1);
        }, 900 + i * 1100),
      );
    });
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [usingLive]);

  const previewMessages: DemoChatMessage[] = useMemo(
    () =>
      PREVIEW_STEPS.slice(0, previewCount).map((step, i) => ({
        id: `preview-${i}`,
        role: step.role,
        body: step.body,
        time: "Now",
      })),
    [previewCount],
  );

  const displayLive = usingLive ? liveMessages : previewMessages;

  const livePreview =
    displayLive.length > 0
      ? displayLive[displayLive.length - 1]?.body.slice(0, 48) +
        (displayLive[displayLive.length - 1]!.body.length > 48 ? "…" : "")
      : "Tap Hello on the phone to start";

  const selectedStatic = STATIC_THREADS.find((t) => t.id === selectedId);
  const selectedGuest =
    selectedId === "live" ? LIVE_GUEST : guestById(selectedStatic?.guestId ?? "");

  const chatMessages =
    selectedId === "live" ? displayLive : (selectedStatic?.staticMessages ?? []);

  const lastMessage = chatMessages[chatMessages.length - 1];
  const canStaffReply =
    selectedId === "live" && Boolean(lastMessage && lastMessage.role !== "staff");

  useEffect(() => {
    setStaffDraft("");
  }, [selectedId]);

  const sendStaffReply = () => {
    const text = staffDraft.trim();
    if (!text || !canStaffReply) return;
    guestAppend("staff", text);
    setStaffDraft("");
  };

  const onSplitterPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const split = splitRef.current;
    if (!split) return;

    const startX = e.clientX;
    const startW = listWidthPx ?? LIST_WIDTH_DEFAULT;

    const onMove = (ev: PointerEvent) => {
      const maxW = split.getBoundingClientRect().width * LIST_WIDTH_MAX_RATIO;
      const next = Math.min(maxW, Math.max(LIST_WIDTH_MIN, startW + (ev.clientX - startX)));
      setListWidthPx(next);
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const splitStyle =
    listWidthPx != null
      ? ({ "--inbox-v2-list-w": `${Math.round(listWidthPx)}px` } as React.CSSProperties)
      : undefined;

  const threadTitle =
    selectedId === "live" && selectedGuest
      ? guestLabel(selectedGuest)
      : selectedGuest
        ? guestLabel(selectedGuest)
        : "Guest";

  return (
    <div ref={splitRef} className="inbox-v2 demo-ui-font demo-scroll-hidden" style={splitStyle}>
      <nav className="inbox-v2-rail" aria-label="App navigation">
        <span className="inbox-v2-rail-logo" aria-hidden>
          <IconSparkles size={16} />
        </span>
        <NavIcon>
          <IconInbox size={16} />
        </NavIcon>
        <NavIcon>
          <IconUsers size={16} />
        </NavIcon>
        <NavIcon>
          <IconMenu size={16} />
        </NavIcon>
        <span className="inbox-v2-rail-spacer" />
        <NavIcon>
          <IconSettings size={16} />
        </NavIcon>
      </nav>

      <aside className="inbox-v2-list-col" aria-label="Guest conversations">
        <header className="inbox-v2-list-head">
          <h4 className="inbox-v2-list-title">Riverside Inbox</h4>
          <div className="inbox-v2-list-tools" aria-hidden>
            <span className="inbox-v2-list-tool">
              <IconSearch size={15} />
            </span>
            <span className="inbox-v2-list-tool">
              <IconSort size={15} />
            </span>
            <span className="inbox-v2-list-tool">
              <IconMenu size={15} />
            </span>
          </div>
        </header>

        <div className="inbox-v2-thread-list demo-scroll-hidden" role="listbox" aria-label="Threads">
          <button
            type="button"
            role="option"
            aria-selected={selectedId === "live"}
            className={`inbox-v2-thread${selectedId === "live" ? " inbox-v2-thread--active" : ""}${
              usingLive ? " inbox-v2-thread--synced" : ""
            }`}
            onClick={() => setSelectedId("live")}
          >
            <Badge.Anchor>
              <DemoAvatar guest={LIVE_GUEST} size="sm" className="inbox-v2-thread-avatar-ui" />
              {usingLive ? <Badge color="success" size="sm" placement="bottom-right" /> : null}
            </Badge.Anchor>
            <span className="inbox-v2-thread-body">
              <span className="inbox-v2-thread-top">
                <span className="inbox-v2-thread-name">{LIVE_GUEST.name}</span>
                <span className="inbox-v2-thread-time">{usingLive ? "Now" : "Live"}</span>
              </span>
              <span className="inbox-v2-thread-preview">Room {LIVE_GUEST.room} · {livePreview}</span>
            </span>
          </button>

          {STATIC_THREADS.map((thread) => {
            const guest = guestById(thread.guestId);
            if (!guest) return null;
            return (
              <button
                key={thread.id}
                type="button"
                role="option"
                aria-selected={selectedId === thread.id}
                className={`inbox-v2-thread${selectedId === thread.id ? " inbox-v2-thread--active" : ""}`}
                onClick={() => setSelectedId(thread.id)}
              >
                <DemoAvatar guest={guest} size="sm" className="inbox-v2-thread-avatar-ui" />
                <span className="inbox-v2-thread-body">
                  <span className="inbox-v2-thread-top">
                    <span className="inbox-v2-thread-name">{guest.name}</span>
                    <span className="inbox-v2-thread-time">{thread.time}</span>
                  </span>
                  <span className="inbox-v2-thread-preview">
                    Room {guest.room} · {thread.preview}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      <div
        className="inbox-v2-splitter"
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize guest list and conversation"
        tabIndex={0}
        onPointerDown={onSplitterPointerDown}
        onDoubleClick={() => setListWidthPx(null)}
        title="Drag to resize columns. Double-click to reset."
      />

      <section className="inbox-v2-chat-col" aria-label="Conversation">
        <header className="inbox-v2-chat-head">
          {selectedGuest ? (
            <DemoAvatar guest={selectedGuest} size="sm" className="inbox-v2-chat-head-avatar" />
          ) : null}
          <h4 className="inbox-v2-chat-title">{threadTitle}</h4>
          {selectedId === "live" && usingLive ? (
            <span className="inbox-v2-chat-badge">Live</span>
          ) : null}
        </header>

        <div className="inbox-v2-chat-body">
          {chatMessages.length === 0 ? (
            <p className="inbox-v2-empty">Conversation will appear here…</p>
          ) : (
            <ChatBubbles messages={chatMessages} guest={selectedGuest} scrollRef={chatScrollRef} />
          )}
        </div>

        <footer className="inbox-v2-compose-bar" aria-label="Message guest">
          <span className="inbox-v2-compose-attach" aria-hidden={canStaffReply}>
            <IconPaperclip size={16} />
          </span>
          {canStaffReply ? (
            <input
              type="text"
              className="inbox-v2-compose-input"
              value={staffDraft}
              onChange={(e) => setStaffDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendStaffReply();
                }
              }}
              placeholder={`Write to ${LIVE_GUEST.name.split(" ")[0]}…`}
              aria-label={`Message ${LIVE_GUEST.name}`}
            />
          ) : (
            <span className="inbox-v2-compose-field" aria-hidden>
              Write to {(selectedGuest ?? LIVE_GUEST).name.split(" ")[0]}…
            </span>
          )}
          <button
            type="button"
            className="inbox-v2-compose-send"
            aria-label="Send message"
            disabled={!canStaffReply || !staffDraft.trim()}
            onClick={sendStaffReply}
          >
            <IconArrowUp size={16} />
          </button>
        </footer>
      </section>
    </div>
  );
}
