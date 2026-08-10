"use client";

import { useRouter } from "next/navigation";

export default function BackButton({ fallback }: { fallback: string }) {
  const router = useRouter();

  function goBack() {
    try {
      const referrer = document.referrer;
      if (referrer && new URL(referrer).origin === window.location.origin) {
        router.back();
        return;
      }
    } catch {
      // Fall through to the catalog route.
    }

    router.push(fallback);
  }

  return (
    <button className="detail-back" type="button" onClick={goBack} aria-label="Go back">
      <span aria-hidden="true">←</span>
      <span>Back</span>
    </button>
  );
}
