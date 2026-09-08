"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { rememberWatch } from "@/lib/watch-history";
import type { MediaItem, MediaType } from "@/lib/types";

const PING_EVENT = "jordflix:companion:ping";
const PONG_EVENT = "jordflix:companion:pong";
const COMPANION_ATTR = "data-jordflix-companion";

type NavigatorWithUAData = Navigator & {
  userAgentData?: {
    mobile?: boolean;
    brands?: Array<{ brand: string; version: string }>;
  };
};

function isDesktopChromiumExtensionBrowser() {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;

  const nav = navigator as NavigatorWithUAData;
  const ua = navigator.userAgent;
  const brands = nav.userAgentData?.brands || [];

  const mobileDevice = Boolean(nav.userAgentData?.mobile)
    || /Android|iPhone|iPad|iPod|Mobile|CriOS|EdgiOS|FxiOS/i.test(ua)
    || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1);

  if (mobileDevice) return false;
  if (!window.matchMedia("(min-width: 768px)").matches) return false;

  if (brands.length > 0) {
    return brands.some(item => /Chromium|Google Chrome|Microsoft Edge|Opera|Brave|Vivaldi/i.test(item.brand));
  }

  return /Chrome\/\d+|Chromium\/\d+|Edg\/\d+|OPR\/\d+|Opera|Vivaldi|YaBrowser/i.test(ua)
    && !/Firefox|FxiOS|Safari\/.*Version\//i.test(ua);
}

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

export default function WatchGate({ item, type }: { item: MediaItem; type: MediaType }) {
  const [open, setOpen] = useState(false);
  const [checking, setChecking] = useState(false);
  const installUrl = process.env.NEXT_PUBLIC_JORDFLIX_EXTENSION_URL?.trim() || "";

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const registerWatch = () => {
    const shouldCount = rememberWatch(type, item);
    if (!shouldCount) return;

    void fetch("/api/activity/watch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, item }),
      keepalive: true,
    }).catch(() => undefined);
  };

  const proceed = () => {
    registerWatch();
    setOpen(false);
    scrollToPlayer();
  };

  const handleWatch = async () => {
    if (checking) return;

    if (!isDesktopChromiumExtensionBrowser()) {
      proceed();
      return;
    }

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
    if (checking || !isDesktopChromiumExtensionBrowser()) return;
    setChecking(true);
    const detected = await detectCompanion(600);
    setChecking(false);
    if (detected) proceed();
  };

  const prompt = open && typeof document !== "undefined"
    ? createPortal(
        <div className="companion-prompt-layer" role="presentation" onMouseDown={event => {
          if (event.target === event.currentTarget) setOpen(false);
        }}>
          <section className="companion-prompt" role="dialog" aria-modal="true" aria-labelledby="companion-title">
            <button className="companion-close" type="button" onClick={() => setOpen(false)} aria-label="Close Companion prompt">×</button>

            <div className="companion-mark" aria-hidden="true"><span>J</span></div>
            <span className="eyebrow">Optional Chromium browser protection</span>
            <h2 id="companion-title">Jordflix Companion wasn’t detected.</h2>
            <p>
              The Companion helps block popup tabs opened by configured playback servers in supported desktop Chromium browsers such as Chrome, Edge, Brave, Opera, and Vivaldi. Jordflix still works without it, and it does not remove ads rendered inside the video frame itself.
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
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <button className="button primary watch-gate-button" type="button" onClick={handleWatch} disabled={checking}>
        {checking ? "Checking…" : "▶ Watch now"}
      </button>
      {prompt}
    </>
  );
}
