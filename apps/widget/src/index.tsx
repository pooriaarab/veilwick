import { render } from "preact";
import { App } from "./app";
import { WIDGET_CSS } from "./styles";
import type { ClientConfig } from "./api";

/**
 * Entrypoint. Auto-initializes when the bundle is loaded via a `<script>`
 * tag on the tenant site. Configuration comes from `data-*` attributes:
 *
 *   <script
 *     src="https://app.example.com/widget/widget.js"
 *     data-agent-id="agt_..."
 *     data-public-key="pk_..."
 *     data-api-base="https://app.example.com"
 *     defer
 *   ></script>
 *
 * The script is responsible for nothing else — the widget mounts itself.
 */

declare global {
  interface Window {
    __mtVisitorWidgetInitialized?: boolean;
  }
}

function readConfig(script: HTMLScriptElement): ClientConfig | null {
  const agentId = script.dataset.agentId ?? "";
  const publicKey = script.dataset.publicKey ?? "";
  const apiBase =
    script.dataset.apiBase ??
    new URL(script.src, window.location.href).origin;
  if (!agentId || !publicKey) {
    // eslint-disable-next-line no-console
    console.warn(
      "[mt-visitor-widget] missing data-agent-id or data-public-key; widget not initialised",
    );
    return null;
  }
  return { agentId, publicKey, apiBase };
}

function injectStyles() {
  if (document.getElementById("mt-vw-styles")) return;
  const style = document.createElement("style");
  style.id = "mt-vw-styles";
  style.textContent = WIDGET_CSS;
  document.head.appendChild(style);
}

function mount(config: ClientConfig) {
  if (window.__mtVisitorWidgetInitialized) return;
  window.__mtVisitorWidgetInitialized = true;

  injectStyles();
  const host = document.createElement("div");
  host.className = "mt-vw-host";
  host.id = "mt-vw-host";
  document.body.appendChild(host);
  render(<App config={config} />, host);
}

function autoInit() {
  // `currentScript` is null when called from DOMContentLoaded, so look up
  // the script tag by src match if needed.
  const current =
    (document.currentScript as HTMLScriptElement | null) ??
    document.querySelector<HTMLScriptElement>(
      'script[data-agent-id][data-public-key]',
    );
  if (!current) return;
  const cfg = readConfig(current);
  if (!cfg) return;
  if (document.body) {
    mount(cfg);
  } else {
    document.addEventListener("DOMContentLoaded", () => mount(cfg), {
      once: true,
    });
  }
}

autoInit();
