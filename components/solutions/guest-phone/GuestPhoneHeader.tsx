"use client";

type GuestPhoneHeaderProps = {
  onOpenProfile: () => void;
};

function BackChevron() {
  return (
    <svg width="12" height="20" viewBox="0 0 12 20" fill="none" aria-hidden>
      <path
        d="M10 2L2 10l8 8"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BrandChevron() {
  return (
    <svg width="8" height="14" viewBox="0 0 8 14" fill="none" aria-hidden className="lojj-phone-topbar-brand-chevron">
      <path
        d="M1.5 1.5L6.5 7l-5 5.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProfileGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="9" r="3.75" fill="currentColor" />
      <path
        d="M5.25 20.25c1.35-3.75 4.1-5.75 6.75-5.75s5.4 2 6.75 5.75"
        fill="currentColor"
      />
    </svg>
  );
}

/** LOJJ guest-app top bar — back + brand + profile */
export default function GuestPhoneHeader({ onOpenProfile }: GuestPhoneHeaderProps) {
  return (
    <header className="lojj-phone-topbar">
      <button type="button" className="lojj-phone-topbar-back" aria-label="Back">
        <BackChevron />
      </button>

      <div className="lojj-phone-topbar-brand" aria-hidden>
        <span className="lojj-phone-topbar-logo-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element -- brand mark in mock UI */}
          <img src="/lojj-review-hub.png" alt="LOJJ" className="lojj-phone-topbar-logo" width={44} height={44} />
        </span>
        <span className="lojj-phone-topbar-pill">
          <span className="lojj-phone-topbar-pill-text">LOJJ</span>
          <BrandChevron />
        </span>
      </div>

      <button
        type="button"
        className="lojj-phone-topbar-profile"
        aria-label="LOJJ contact info"
        onClick={onOpenProfile}
      >
        <ProfileGlyph />
      </button>
    </header>
  );
}
