const STORAGE_KEY = 'visitor_id';
const VALID_ID_REGEX = /^[A-Za-z0-9_-]{4,64}$/;
const API_BASE = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '');

let memoryVisitorId = null;

function generateVisitorId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `vid_${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`;
  }
  const rand = Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
  return `vid_${rand}`;
}

export function getVisitorId() {
  if (typeof window === 'undefined') return null;

  if (memoryVisitorId && VALID_ID_REGEX.test(memoryVisitorId)) {
    return memoryVisitorId;
  }

  try {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing && VALID_ID_REGEX.test(existing)) {
      memoryVisitorId = existing;
      return existing;
    }

    const created = generateVisitorId();
    window.localStorage.setItem(STORAGE_KEY, created);
    memoryVisitorId = created;
    return created;
  } catch {
    if (!memoryVisitorId) {
      memoryVisitorId = generateVisitorId();
    }
    return memoryVisitorId;
  }
}

function resolveRequestUrl(input) {
  if (typeof input === 'string') return input;
  if (typeof URL !== 'undefined' && input instanceof URL) return input.href;
  if (typeof Request !== 'undefined' && input instanceof Request) return input.url;
  return '';
}

function isBackendApiRequest(url) {
  if (!url || !API_BASE) return false;
  if (!url.startsWith(API_BASE)) return false;
  const rest = url.slice(API_BASE.length).replace(/^\/+/, '');
  return rest.startsWith('api/');
}

export function initVisitorTracking() {
  if (typeof window === 'undefined') return null;

  const visitorId = getVisitorId();

  if (!window.__visitorFetchPatched && typeof window.fetch === 'function') {
    const originalFetch = window.fetch;

    window.fetch = function patchedVisitorFetch(input, init) {
      const targetUrl = resolveRequestUrl(input);

      if (isBackendApiRequest(targetUrl)) {
        const currentVisitorId = getVisitorId();
        if (currentVisitorId) {
          const baseHeaders =
            init?.headers ||
            (typeof Request !== 'undefined' && input instanceof Request ? input.headers : undefined);
          const headers = new Headers(baseHeaders);
          if (!headers.has('X-Visitor-ID')) {
            headers.set('X-Visitor-ID', currentVisitorId);
          }
          return originalFetch.call(this, input, { ...init, headers });
        }
      }

      return originalFetch.call(this, input, init);
    };

    window.__visitorFetchPatched = true;
  }

  return visitorId;
}
