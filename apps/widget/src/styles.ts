/**
 * Inline widget CSS. Kept as a string export so the bundle stays a single
 * IIFE — no separate widget.css HTTP request.
 *
 * Class names are prefixed with `mt-vw-` (master-template visitor widget)
 * so the widget never collides with the host page's stylesheet.
 */

export const WIDGET_CSS = `
.mt-vw-host {
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 2147483647;
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 14px;
  color: #0f172a;
}
.mt-vw-host * {
  box-sizing: border-box;
}
.mt-vw-bubble {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #0f172a;
  color: #fff;
  border: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 24px rgba(0,0,0,0.15);
  transition: transform 0.15s;
}
.mt-vw-bubble:hover {
  transform: scale(1.05);
}
.mt-vw-bubble svg {
  width: 24px;
  height: 24px;
}
.mt-vw-panel {
  width: 360px;
  height: 520px;
  max-height: calc(100vh - 32px);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.mt-vw-header {
  padding: 12px 16px;
  background: #0f172a;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.mt-vw-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}
.mt-vw-close {
  background: transparent;
  border: 0;
  color: #fff;
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
}
.mt-vw-messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #f8fafc;
}
.mt-vw-msg {
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 12px;
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.4;
}
.mt-vw-msg-user {
  align-self: flex-end;
  background: #0f172a;
  color: #fff;
  border-bottom-right-radius: 2px;
}
.mt-vw-msg-assistant {
  align-self: flex-start;
  background: #fff;
  color: #0f172a;
  border: 1px solid #e2e8f0;
  border-bottom-left-radius: 2px;
}
.mt-vw-msg-error {
  align-self: stretch;
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
  font-size: 13px;
}
.mt-vw-input-row {
  display: flex;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid #e2e8f0;
  background: #fff;
}
.mt-vw-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  outline: none;
}
.mt-vw-input:focus {
  border-color: #0f172a;
}
.mt-vw-send {
  padding: 8px 16px;
  background: #0f172a;
  color: #fff;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}
.mt-vw-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.mt-vw-empty {
  text-align: center;
  color: #64748b;
  padding: 24px 16px;
  font-size: 13px;
}
`;
