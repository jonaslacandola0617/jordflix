(() => {
  if (globalThis.__jordflixCompanionLoaded) return;
  globalThis.__jordflixCompanionLoaded = true;

  const COMPANION_ATTR = "data-jordflix-companion";
  const PING_EVENT = "jordflix:companion:ping";
  const PONG_EVENT = "jordflix:companion:pong";
  let lastHostSignature = "";

  function markReady() {
    document.documentElement?.setAttribute(COMPANION_ATTR, "ready");
  }

  function announce() {
    markReady();
    window.dispatchEvent(new CustomEvent(PONG_EVENT));
  }

  function collectPlayerHosts() {
    const hosts = new Set();

    document.querySelectorAll("iframe.embed-player").forEach(frame => {
      try {
        const url = new URL(frame.src);
        if (url.protocol === "http:" || url.protocol === "https:") hosts.add(url.hostname);
      } catch {
        // Ignore invalid or incomplete iframe URLs.
      }
    });

    return [...hosts].sort();
  }

  function syncPlayerHosts() {
    markReady();
    const hosts = collectPlayerHosts();
    const signature = hosts.join("|");
    if (!hosts.length || signature === lastHostSignature) return;
    lastHostSignature = signature;

    chrome.runtime.sendMessage({
      type: "JORDFLIX_REGISTER_PLAYER_HOSTS",
      hosts,
    }).catch(() => {
      // The background worker can be restarting; the next DOM change will retry.
      lastHostSignature = "";
    });
  }

  window.addEventListener(PING_EVENT, announce);
  markReady();

  const startObserver = () => {
    if (!document.documentElement) return;
    const observer = new MutationObserver(syncPlayerHosts);
    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["src"],
    });
    syncPlayerHosts();
  };

  if (document.documentElement) startObserver();
  else document.addEventListener("readystatechange", startObserver, { once: true });
})();
