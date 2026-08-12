const RULE_ID_BASE = 100000;
const MAX_LEARNED_HOSTS = 32;
const JORDFLIX_MATCHES = [
  "https://jordflix.vercel.app/*",
  "http://localhost:3000/*",
];

function normalizeHost(value) {
  if (typeof value !== "string") return null;
  const host = value.trim().toLowerCase();
  if (!host || host.length > 253) return null;
  if (!/^[a-z0-9.-]+$/.test(host)) return null;
  if (host.startsWith(".") || host.endsWith(".")) return null;
  return host;
}

function preferredRuleId(host) {
  let hash = 2166136261;
  for (let index = 0; index < host.length; index += 1) {
    hash ^= host.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return RULE_ID_BASE + (Math.abs(hash >>> 0) % 1000000000);
}

async function registerPlayerHosts(rawHosts) {
  const incoming = [...new Set((Array.isArray(rawHosts) ? rawHosts : []).map(normalizeHost).filter(Boolean))];
  if (!incoming.length) return { added: 0 };

  const existing = await chrome.declarativeNetRequest.getSessionRules();
  const knownHosts = new Set(
    existing.flatMap(rule => Array.isArray(rule.condition?.initiatorDomains) ? rule.condition.initiatorDomains : [])
  );
  const usedIds = new Set(existing.map(rule => rule.id));
  const remainingCapacity = Math.max(0, MAX_LEARNED_HOSTS - knownHosts.size);
  const pendingHosts = incoming.filter(host => !knownHosts.has(host)).slice(0, remainingCapacity);

  const addRules = pendingHosts.map(host => {
    let id = preferredRuleId(host);
    while (usedIds.has(id)) id += 1;
    usedIds.add(id);

    return {
      id,
      priority: 1,
      action: { type: "block" },
      condition: {
        initiatorDomains: [host],
        resourceTypes: ["main_frame"],
      },
    };
  });

  if (addRules.length) {
    await chrome.declarativeNetRequest.updateSessionRules({ addRules });
  }

  return { added: addRules.length };
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "JORDFLIX_REGISTER_PLAYER_HOSTS") return false;

  registerPlayerHosts(message.hosts)
    .then(result => sendResponse({ ok: true, ...result }))
    .catch(error => sendResponse({ ok: false, error: error instanceof Error ? error.message : String(error) }));

  return true;
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.query({ url: JORDFLIX_MATCHES })
    .then(tabs => Promise.all(tabs.map(tab => {
      if (typeof tab.id !== "number") return Promise.resolve();
      return chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"],
      }).catch(() => undefined);
    })))
    .catch(() => undefined);
});
