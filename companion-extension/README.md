# Jordflix Companion

A lightweight Manifest V3 Chrome extension for Jordflix playback popup protection.

## What it does

- Lets Jordflix detect whether the Companion is installed and enabled.
- Watches the active Jordflix playback iframe and learns its hostname.
- Adds session-scoped `declarativeNetRequest` rules that block top-level popup navigations initiated by learned player hosts.
- Keeps the Jordflix iframe unsandboxed for better player compatibility.

It does **not** remove advertisements rendered inside a cross-origin player iframe. Its purpose is to stop popup/new-tab navigation from configured playback servers.

## Local testing

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Choose **Load unpacked**.
4. Select the `companion-extension` folder.
5. Open or refresh Jordflix.
6. Click **Watch now**. Jordflix should detect the Companion and proceed directly to the player.

The extension is also configured for `http://localhost:3000/*` so the detection flow can be tested locally.

## Publishing

For normal Chrome users, publish this folder through the Chrome Web Store. Once the listing exists, set the following Vercel environment variable and redeploy Jordflix:

```env
NEXT_PUBLIC_JORDFLIX_EXTENSION_URL=https://chromewebstore.google.com/detail/your-extension-id
```

Chrome does not support silent website-driven extension installation for normal Windows/macOS users. The user must complete installation through the Chrome Web Store.

## Architecture

The content script marks Jordflix with `data-jordflix-companion="ready"` and responds to the website's ping event. It also discovers the hostname of the active `.embed-player` iframe and reports it to the service worker.

The service worker adds session rules that block `main_frame` requests whose initiator is a learned player hostname. Because the player iframe itself loads as a `sub_frame`, the player is not blocked; only top-level navigations initiated by that player host are targeted.
