/**
 * EWD Auto-Scroll Utility
 * Smoothly scrolls to a DOM element by ID after a delay.
 * Accounts for the fixed staff bar (72px) at the bottom.
 */

const HEADER_OFFSET = 80; // account for site header

export function scrollToElement(elementId, delayMs = 600) {
  setTimeout(() => {
    const el = document.getElementById(elementId);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
  }, delayMs);
}

/**
 * Scroll to the next sibling section ID after an interaction.
 * Usage: scrollToNext("ewd-quiz-card-2")
 */
export function scrollToNext(nextId, delayMs = 650) {
  scrollToElement(nextId, delayMs);
}
