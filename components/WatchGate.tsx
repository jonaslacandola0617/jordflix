"use client";

import { useEffect, useState } from "react";

const PING_EVENT = "jordflix:companion:ping";
const PONG_EVENT = "jordflix:companion:pong";
const COMPANION_ATTR = "data-jordflix-companion";

function markerPresent() {
  return typeof document !== "undefined" && document.documentElement.getAttribute(COMPANION_ATTR) === "ready";
}

function detectCompanion(timeout = 320) {
  if (markerPresent()) return Promise.resolve(true);

  return new Promise<boolean>(resolve => {
    let settled = false;
    let timer = 0;

    const finish = (detected: boolean) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      window.removeEventListener(PONG_EVENT, onPong);
      resolve(detected);
    };

    const onPong = () => finish(true);
    window.addEventListener(PONG_EVENT, onPong, { once: true });
    window.dispatchEvent(new CustomEvent(PING_EVENT));
    timer = window.setTimeout(() => finish(markerPresent()), timeout);
  });
}

function scrollToPlayer() {
  window.requestAnimationFrame(() => {
    document.getElementById("watch")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

export default function WatchGate() {
  const [open, setOpen] = useState(false);
  const [checking, setChecking] = useState(false);
  const installUrl = process.env.NEXT_PUBLIC_JORDFLIX_EXTENSION_URL?.trim() || "";

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const proceed = () => {
    setOpen(false);
    scrollToPlayer();
  };

  const handleWatch = async () => {
    if (checking) return;
    setChecking(true);
    const detected = await detectCompanion();
    setChecking(false);

    if (detected) {
      proceed();
      return;
    }

    setOpen(true);
  };

  const checkAgain = async () => {
    if (checking) return;
    setChecking(true);
    const detected = await detectCompanion(600);
    setChecking(false);
    if (detected) proceed();
  };

  return (
    <>
      <button className="button primary watch-gate-button" type="button" onClick={handleWatch} disabled={checking}>
        {checking ? "Checking…" : "▶ Watch now"}
      </button>

      {open && (
        <div className="companion-prompt-layer" role="presentation">
          <section className="companion-prompt" role="dialog" aria-modal="true" aria-labelledby="companion-title">
            <button className="companion-close" type="button" onClick={() => setOpen(false)} aria-label="Close Companion prompt">×</button>

            <div className="companion-mark" aria-hidden="true"><span>J</span></div>
            <span className="eyebrow">Optional browser protection</span>
            <h2 id="companion-title">Jordflix Companion wasn’t detected.</h2>
            <p>
              The Companion helps block popup tabs opened by configured playback servers. Jordflix still works without it, and it does not remove ads rendered inside the video frame itself.
            </p>

            <div className="companion-prompt-actions">
              {installUrl ? (
                <a className="button primary companion-install" href={installUrl} target="_blank" rel="noopener noreferrer">
                  Install Companion ↗
                </a>
              ) : (
                <button className="button primary companion-install" type="button" disabled title="Set NEXT_PUBLIC_JORDFLIX_EXTENSION_URL after publishing the extension.">
                  Store listing coming soon
                </button>
              )}
              <button className="button ghost companion-continue" type="button" onClick={proceed}>Continue without protection</button>
            </div>

            <button className="companion-recheck" type="button" onClick={checkAgain} disabled={checking}>
              {checking ? "Checking for Companion…" : "Already installed? Check again"}
            </button>
          </section>
        </div>
      )}
    </>
  );
}
