import type { SVGProps } from "react";

/** iMessage composer microphone */
export function Icon3(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <rect x="9" y="3" width="6" height="11" rx="3" fill="#d9d9d9" />
      <path
        d="M5.5 11.5a6.5 6.5 0 0 0 13 0"
        fill="none"
        stroke="#d9d9d9"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <line x1="12" y1="18.2" x2="12" y2="21" stroke="#d9d9d9" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
