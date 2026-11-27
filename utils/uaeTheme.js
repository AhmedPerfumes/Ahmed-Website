import { useState, useEffect } from "react";

const MAX_TIMEOUT_MS = 2147483647; // Max safe 32-bit signed int (~24.8 days)

/**
 * Cross-browser parser for UAE theme timer dates in .env.
 * Supports:
 * - Full ISO with timezone: "2026-12-05T23:59:59+04:00" or "...Z"
 * - Date + time without timezone (defaults to GST +04:00): "2026-12-05 23:59:59" or "2026-12-05T23:59"
 * - Date only (defaults to 00:00:00+04:00 for start, 23:59:59+04:00 for end): "2026-12-05"
 */
export function parseUaeThemeDate(raw, isEnd = false) {
  if (!raw || typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  let normalized = trimmed;
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    normalized = `${trimmed}T${isEnd ? "23:59:59" : "00:00:00"}+04:00`;
  } else {
    const iso = trimmed.replace(" ", "T");
    const withSeconds = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(iso)
      ? `${iso}:${isEnd ? "59" : "00"}`
      : iso;
    const hasTz =
      withSeconds.endsWith("Z") ||
      /[+-]\d{2}:?\d{2}$/.test(withSeconds);
    normalized = hasTz ? withSeconds : `${withSeconds}+04:00`;
  }

  const parsed = new Date(normalized);
  const ms = parsed.getTime();
  return Number.isNaN(ms) ? null : ms;
}

/**
 * Reads the UAE theme schedule from NEXT_PUBLIC_UAE_THEME_* env variables.
 */
export function getUaeThemeSchedule() {
  const rawEnabled = process.env.NEXT_PUBLIC_UAE_THEME_ENABLED;
  const enabled =
    rawEnabled === undefined ||
    rawEnabled === null ||
    String(rawEnabled).trim() === ""
      ? true
      : !["false", "0", "no", "off"].includes(String(rawEnabled).trim().toLowerCase());

  const startMs = parseUaeThemeDate(process.env.NEXT_PUBLIC_UAE_THEME_START_DATE, false);
  const endMs = parseUaeThemeDate(process.env.NEXT_PUBLIC_UAE_THEME_END_DATE, true);

  return { enabled, startMs, endMs };
}

/**
 * Evaluates whether the UAE National Day design (Header, ProductCard, TabSlider, BogoBadge)
 * should be active at `nowMs`. Fails safe to `false` (original design) if disabled or expired.
 */
export function isUaeThemeActive(nowMs = Date.now()) {
  const { enabled, startMs, endMs } = getUaeThemeSchedule();
  if (!enabled) return false;
  if (endMs === null) return false;
  if (startMs !== null && nowMs < startMs) return false;
  if (nowMs > endMs) return false;
  return true;
}

/**
 * Computes milliseconds until the next automatic theme transition (start or end),
 * or null if no future transition exists.
 */
function getMsUntilNextTransition(nowMs = Date.now()) {
  const { enabled, startMs, endMs } = getUaeThemeSchedule();
  if (!enabled || endMs === null) return null;

  if (startMs !== null && nowMs < startMs) {
    return startMs - nowMs;
  }
  if (nowMs <= endMs) {
    return endMs - nowMs + 1;
  }
  return null;
}

// Shared singleton timer so all subscribed components (Header, MobileHeader, ProductCards, Sliders)
// share a single timer & visibility listener instead of creating dozens of separate timers.
const listeners = new Set();
let currentActiveState = isUaeThemeActive();
let timerId = null;
let windowListenersAttached = false;

function clearScheduledTimer() {
  if (timerId !== null) {
    clearTimeout(timerId);
    timerId = null;
  }
}

function syncAndSchedule() {
  clearScheduledTimer();
  const nextActive = isUaeThemeActive();
  if (nextActive !== currentActiveState) {
    currentActiveState = nextActive;
    listeners.forEach((fn) => fn(currentActiveState));
  }

  if (listeners.size === 0 || typeof window === "undefined") return;

  const msRemaining = getMsUntilNextTransition();
  if (msRemaining !== null && msRemaining > 0) {
    const delay = Math.min(msRemaining + 100, MAX_TIMEOUT_MS);
    timerId = setTimeout(syncAndSchedule, delay);
  }
}

function handleVisibilityOrFocus() {
  if (typeof document !== "undefined" && document.visibilityState === "hidden") {
    return;
  }
  syncAndSchedule();
}

function subscribeUaeTheme(listener) {
  listeners.add(listener);

  if (typeof window !== "undefined" && !windowListenersAttached) {
    window.addEventListener("visibilitychange", handleVisibilityOrFocus);
    window.addEventListener("focus", handleVisibilityOrFocus);
    windowListenersAttached = true;
  }

  syncAndSchedule();

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      clearScheduledTimer();
      if (typeof window !== "undefined" && windowListenersAttached) {
        window.removeEventListener("visibilitychange", handleVisibilityOrFocus);
        window.removeEventListener("focus", handleVisibilityOrFocus);
        windowListenersAttached = false;
      }
    }
  };
}

/**
 * React hook that returns `true` while the UAE National Day design window is active
 * and automatically flips between the new design and original design in real time
 * when NEXT_PUBLIC_UAE_THEME_START_DATE or NEXT_PUBLIC_UAE_THEME_END_DATE is reached.
 */
export function useUaeTheme() {
  const [active, setActive] = useState(() => isUaeThemeActive());

  useEffect(() => {
    setActive(isUaeThemeActive());
    return subscribeUaeTheme((nextState) => {
      setActive(nextState);
    });
  }, []);

  return active;
}
