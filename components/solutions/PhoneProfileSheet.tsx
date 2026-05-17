"use client";

import { useEffect, useId } from "react";

type PhoneProfileSheetProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  name: string;
  initials?: string;
  meta: string[];
};

function deriveInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
  }
  const w = parts[0] ?? "?";
  return w.slice(0, 2).toUpperCase();
}

export default function PhoneProfileSheet({
  open,
  onClose,
  title = "Guest",
  name,
  initials,
  meta,
}: PhoneProfileSheetProps) {
  const profileTitleId = useId();
  const profileSheetId = useId();
  const avatar = initials ?? deriveInitials(name);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <button type="button" className="mage-phone-profile-scrim" aria-label="Close profile" onClick={onClose} />
      <aside
        id={profileSheetId}
        className="mage-phone-profile-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby={profileTitleId}
      >
        <div className="mage-phone-profile-sheet-handle" aria-hidden />
        <h2 id={profileTitleId} className="mage-phone-profile-title">
          {title}
        </h2>
        <div className="mage-phone-profile-avatar" aria-hidden>
          {avatar}
        </div>
        <p className="mage-phone-profile-name">{name}</p>
        <ul className="mage-phone-profile-meta">
          {meta.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <button type="button" className="mage-phone-profile-done" onClick={onClose}>
          Done
        </button>
      </aside>
    </>
  );
}
