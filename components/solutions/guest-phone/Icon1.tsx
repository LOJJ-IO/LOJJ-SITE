import type { SVGProps } from "react";

/** Dynamic-island status strip for guest phone mock */
export function Icon1(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 422 139"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="guest-phone-icon1"
      aria-hidden
      {...props}
    >
      <path
        d="M26 48C26 35.8497 35.8497 26 48 26H71C83.1503 26 93 35.8497 93 48C93 60.1503 83.1503 70 71 70H48C35.8497 70 26 60.1503 26 48Z"
        fill="#fff"
      />
      <g opacity="0.67">
        <mask id="guest_phone_mask_island" maskUnits="userSpaceOnUse" x="-50" y="-50" width="219" height="196">
          <rect width="219" height="196" transform="translate(-50 -50)" fill="#fff" />
          <rect x="26" y="26" width="67" height="44" rx="22" fill="#000" />
        </mask>
        <g mask="url(#guest_phone_mask_island)" />
      </g>
    </svg>
  );
}
