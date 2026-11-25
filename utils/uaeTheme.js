import { useState, useEffect } from "react";

/**
 * Checks whether the UAE National Day product card theme is currently active
 * based on NEXT_PUBLIC_UAE_THEME_END_DATE in .env.
 *
 * Accepts ISO strings (e.g. "2026-12-05T23:59:59+04:00") or YYYY-MM-DD dates
 * (treated as end-of-day GST, +04:00). Fails safe to false if unset/invalid.
 */
export function isUaeThemeActive(nowMs = Date.now()) {
  const raw = process.env.NEXT_PUBLIC_UAE_THEME_END_DATE;
  if (!raw || typeof raw !== "string") return false;

  const trimmed = raw.trim();
  if (!trimmed) return false;

  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(trimmed)
    ? `${trimmed}T23:59:59+04:00`
    : trimmed;

  const end = new Date(normalized);
  if (isNaN(end.getTime())) return false;

  return nowMs <= end.getTime();
}

/**
 * React hook returning whether the UAE National Day card theme is active.
 * Re-evaluates on mount and schedules automatic fallback if the deadline passes
 * while the page is open.
 */
export function useUaeTheme() {
  const [active, setActive] = useState(() => isUaeThemeActive());

  useEffect(() => {
    const isActive = isUaeThemeActive();
    setActive(isActive);

    if (!isActive) return;

    const raw = process.env.NEXT_PUBLIC_UAE_THEME_END_DATE?.trim();
    if (!raw) return;
    const normalized = /^\d{4}-\d{2}-\d{2}$/.test(raw)
      ? `${raw}T23:59:59+04:00`
      : raw;
    const remaining = new Date(normalized).getTime() - Date.now();

    // Only set a timer if within JS safe 32-bit timeout (~24.8 days)
    if (remaining > 0 && remaining <= 2147483647) {
      const timer = setTimeout(() => setActive(false), remaining + 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  return active;
}
