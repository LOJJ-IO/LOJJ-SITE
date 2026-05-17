"use client";

import { useRef } from "react";

import { AnimatedBeam } from "@/components/ui/animated-beam";
import { AnimatedList } from "@/components/ui/animated-list";
import {
  ReviewPlatformIcon,
  type PlatformId,
} from "@/components/solutions/ReviewPlatformIcons";
import { SOLUTIONS } from "@/lib/solutions";

type GuestUser = {
  id: string;
  name: string;
  likelihood: number;
  curvature: number;
  delay: number;
};

type PlatformNode = {
  id: PlatformId;
  label: string;
  curvature: number;
  delay: number;
};

type ReviewListItem = {
  id: string;
  platform: PlatformId;
  platformLabel: string;
  guest: string;
  excerpt: string;
  stars: number;
};

const GUEST_USERS: GuestUser[] = [
  { id: "g1", name: "Maya R.", likelihood: 94, curvature: 24, delay: 0 },
  { id: "g2", name: "Daniel K.", likelihood: 89, curvature: 8, delay: 0.35 },
  { id: "g3", name: "Amina T.", likelihood: 96, curvature: -8, delay: 0.7 },
  { id: "g4", name: "James L.", likelihood: 86, curvature: -22, delay: 1.05 },
];

const PLATFORMS: PlatformNode[] = [
  { id: "google", label: "Google Reviews", curvature: 28, delay: 0 },
  { id: "tripadvisor", label: "TripAdvisor", curvature: 12, delay: 0.35 },
  { id: "hotels", label: "Hotels.com", curvature: -4, delay: 0.7 },
  { id: "expedia", label: "Expedia", curvature: -18, delay: 1.05 },
  { id: "booking", label: "Booking.com", curvature: -30, delay: 1.4 },
];

const REVIEW_LIST_ITEMS: ReviewListItem[] = [
  {
    id: "rc1",
    platform: "google",
    platformLabel: "Google Reviews",
    guest: "Maya R.",
    excerpt: "Spotless room and seamless check-in — would stay again.",
    stars: 5,
  },
  {
    id: "rc2",
    platform: "tripadvisor",
    platformLabel: "TripAdvisor",
    guest: "Daniel K.",
    excerpt: "Concierge team was incredibly fast and thoughtful.",
    stars: 5,
  },
  {
    id: "rc3",
    platform: "hotels",
    platformLabel: "Hotels.com",
    guest: "Amina T.",
    excerpt: "Loved the quiet floor and turndown details every night.",
    stars: 5,
  },
  {
    id: "rc4",
    platform: "expedia",
    platformLabel: "Expedia",
    guest: "James L.",
    excerpt: "Great value — lobby, bar, and room all felt premium.",
    stars: 5,
  },
  {
    id: "rc5",
    platform: "booking",
    platformLabel: "Booking.com",
    guest: "Sofia P.",
    excerpt: "Check-in was smooth and the team remembered my preferences.",
    stars: 5,
  },
];

function BeamTooltip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <span className="review-beam-tooltip-wrap">
      {children}
      <span className="review-beam-tooltip" role="tooltip">
        {label}
      </span>
    </span>
  );
}

function BeamNode({
  nodeRef,
  className,
  children,
}: {
  nodeRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div ref={nodeRef} className={`review-beam-node ${className ?? ""}`}>
      {children}
    </div>
  );
}

function GuestAvatarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="review-guest-avatar-svg">
      <circle cx="12" cy="8" r="4" fill="#94a3b8" />
      <path fill="#94a3b8" d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8v1H4v-1z" />
    </svg>
  );
}

function ReviewStars({ count }: { count: number }) {
  return (
    <span className="review-beam-stars" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="review-beam-star" aria-hidden>
          ★
        </span>
      ))}
    </span>
  );
}

function ReviewListCard({ item }: { item: ReviewListItem }) {
  return (
    <article className={`review-list-card review-list-card--${item.platform}`}>
      <div className="review-list-card-icon" aria-hidden>
        <ReviewPlatformIcon platform={item.platform} />
      </div>
      <div className="review-list-card-body">
        <div className="review-list-card-head">
          <span className={`review-beam-card-kicker review-beam-card-kicker--${item.platform}`}>
            {item.platformLabel}
          </span>
          <ReviewStars count={item.stars} />
        </div>
        <p className="review-list-card-title">
          New 5★ review from <strong>{item.guest}</strong>
        </p>
        <p className="review-list-card-excerpt">&ldquo;{item.excerpt}&rdquo;</p>
      </div>
    </article>
  );
}

export default function ReviewBeamDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lojjRef = useRef<HTMLDivElement>(null);

  const guest1Ref = useRef<HTMLDivElement>(null);
  const guest2Ref = useRef<HTMLDivElement>(null);
  const guest3Ref = useRef<HTMLDivElement>(null);
  const guest4Ref = useRef<HTMLDivElement>(null);

  const googleRef = useRef<HTMLDivElement>(null);
  const tripRef = useRef<HTMLDivElement>(null);
  const hotelsRef = useRef<HTMLDivElement>(null);
  const expediaRef = useRef<HTMLDivElement>(null);
  const bookingRef = useRef<HTMLDivElement>(null);

  const guestRefList = [guest1Ref, guest2Ref, guest3Ref, guest4Ref];

  const platformRefMap: Record<PlatformId, React.RefObject<HTMLDivElement | null>> = {
    google: googleRef,
    tripadvisor: tripRef,
    hotels: hotelsRef,
    expedia: expediaRef,
    booking: bookingRef,
  };

  const baseGuests = SOLUTIONS.find((s) => s.id === "reviews")?.demo.guests ?? [];
  const guests = GUEST_USERS.map((g, i) => ({
    ...g,
    name: baseGuests[i]?.name ?? g.name,
    likelihood: baseGuests[i]?.score ?? g.likelihood,
  }));

  return (
    <div className="review-routing-demo">
      <div ref={containerRef} className="review-beam-stage" aria-label="Guest to platform review routing">
        <div className="review-beam-users">
          {guests.map((guest, index) => (
            <BeamNode key={guest.id} nodeRef={guestRefList[index]}>
              <BeamTooltip label={guest.name}>
                <span className="review-beam-user-icon">
                  <GuestAvatarIcon />
                </span>
              </BeamTooltip>
            </BeamNode>
          ))}
        </div>

        <div className="review-beam-hub-wrap">
          <BeamNode nodeRef={lojjRef} className="review-beam-hub">
            <BeamTooltip label="LOJJ">
              <span className="review-beam-lojj-glow">
                <span className="review-beam-lojj-icon">
                  {/* eslint-disable-next-line @next/next/no-img-element -- hub brand mark fills circle */}
                  <img src="/lojj-review-hub.png" alt="" className="review-beam-lojj-img" />
                </span>
              </span>
            </BeamTooltip>
          </BeamNode>
        </div>

        <div className="review-beam-platforms">
          {PLATFORMS.map((platform) => (
            <BeamNode key={platform.id} nodeRef={platformRefMap[platform.id]}>
              <BeamTooltip label={platform.label}>
                <span className="review-beam-platform-icon">
                  <ReviewPlatformIcon platform={platform.id} />
                </span>
              </BeamTooltip>
            </BeamNode>
          ))}
        </div>

        {guests.map((guest, index) => (
          <AnimatedBeam
            key={`guest-${guest.id}`}
            containerRef={containerRef}
            fromRef={guestRefList[index]}
            toRef={lojjRef}
            curvature={guest.curvature}
            delay={guest.delay}
            duration={4}
            pathColor="#ffffff"
            pathOpacity={0.45}
            gradientStartColor="#22c55e"
            gradientStopColor="#2563eb"
            startXOffset={8}
            endXOffset={-8}
          />
        ))}

        {PLATFORMS.map((platform) => (
          <AnimatedBeam
            key={`platform-${platform.id}`}
            containerRef={containerRef}
            fromRef={lojjRef}
            toRef={platformRefMap[platform.id]}
            reverse
            curvature={platform.curvature}
            delay={platform.delay}
            duration={4.5}
            pathColor="#ffffff"
            pathOpacity={0.45}
            gradientStartColor="#2563eb"
            gradientStopColor="#7c3aed"
            startXOffset={8}
            endXOffset={-8}
          />
        ))}

        <div className="review-beam-likelihoods review-beam-likelihoods--guests" aria-hidden>
          {guests.map((guest, index) => (
            <span
              key={guest.id}
              className="review-beam-likelihood"
              style={{ top: `${12 + index * 22}%` }}
            >
              {guest.likelihood}%
            </span>
          ))}
        </div>
      </div>

      <div className="review-animated-list-wrap" aria-label="Incoming reviews">
        <p className="review-animated-list-kicker">Live reviews</p>
        <AnimatedList className="review-animated-list" delay={2400}>
          {REVIEW_LIST_ITEMS.map((item) => (
            <ReviewListCard key={item.id} item={item} />
          ))}
        </AnimatedList>
      </div>
    </div>
  );
}
