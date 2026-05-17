"use client";

type FolkIMessageHeaderProps = {
  onOpenProfile: () => void;
};

/** iMessage-style top bar (image asset) — tap opens contact profile */
export default function FolkIMessageHeader({ onOpenProfile }: FolkIMessageHeaderProps) {
  return (
    <div className="folk-imessage-header">
      <button
        type="button"
        className="folk-imessage-header-hit"
        aria-label="LOJJ contact info"
        onClick={onOpenProfile}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- raster top bar mock */}
        <img
          src="/devices/imessage-top-bar.png"
          alt=""
          className="folk-imessage-header-img"
          width={406}
          height={120}
          draggable={false}
        />
      </button>
    </div>
  );
}
