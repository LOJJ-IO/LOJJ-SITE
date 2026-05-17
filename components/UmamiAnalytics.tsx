import Script from "next/script";

const UMAMI_WEBSITE_ID = "80507b03-83ac-47a5-b895-b40e46c82453";
const UMAMI_SCRIPT_URL = "https://cloud.umami.is/script.js";

/** Umami analytics — production only (avoids polluting dashboard with localhost). */
export default function UmamiAnalytics() {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  return (
    <Script
      src={UMAMI_SCRIPT_URL}
      data-website-id={UMAMI_WEBSITE_ID}
      strategy="afterInteractive"
    />
  );
}
