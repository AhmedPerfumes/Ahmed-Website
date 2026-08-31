/**
 * Centralized API Client with JWT Bearer Token Auto-Injection
 * & Automatic 401 Silent Token Refresh.
 *
 * Token storage strategy (XSS-safe):
 *   - Access token  → in-memory module variable (lost on page refresh, restored via silent refresh)
 *   - Refresh token → HttpOnly cookie (set/cleared by backend; invisible to JS)
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

// ── In-memory access token store ──────────────────────────────────────────────
let _accessToken = null;
let isRefreshing = false;
let failedQueue = [];

export const setAccessToken = (token) => { _accessToken = token; };
export const getAccessToken = () => _accessToken;
export const clearAccessToken = () => { _accessToken = null; };

// Backward-compatible alias used by UserContext / other consumers
export const getStoredToken = () => _accessToken;

// ── Auth token helpers ─────────────────────────────────────────────────────────
/**
 * Clear in-memory access token and non-sensitive localStorage data.
 * Does NOT touch the refresh_token cookie — the backend clears that via Set-Cookie.
 */
export const clearStoredTokens = () => {
  _accessToken = null;
  if (typeof window === 'undefined') return;
  localStorage.removeItem('user');
  localStorage.removeItem('address');
  // Legacy cleanup — remove any stale tokens that may exist from old builds
  localStorage.removeItem('token');
  localStorage.removeItem('refresh_token');
};

/**
 * Force logout: clear access token + profile data, then notify the app.
 */
export const forceLogout = () => {
  if (typeof window === 'undefined') return;
  clearStoredTokens();
  window.dispatchEvent(new Event('user-logged-out'));
};

// ── Silent refresh (cookie-based) ─────────────────────────────────────────────
/**
 * Call POST /api/refresh with credentials:include so the browser sends the
 * HttpOnly refresh_token cookie automatically. Returns true on success.
 */
export async function silentRefresh() {
  try {
    const res = await fetch(`${API_BASE}api/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (data.access_token) {
      _accessToken = data.access_token;
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// ── Queue helpers ─────────────────────────────────────────────────────────────
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// ── Main API client ───────────────────────────────────────────────────────────
export async function apiClient(endpoint, options = {}) {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE}${endpoint.startsWith('/') ? endpoint.slice(1) : endpoint}`;

  const headers = { ...options.headers };

  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (_accessToken) {
    headers['Authorization'] = `Bearer ${_accessToken}`;
  }

  const fetchOptions = {
    ...options,
    credentials: 'include', // always send cookies (refresh_token cookie)
    headers,
  };

  try {
    let response = await fetch(url, fetchOptions);

    // On 401 attempt one silent refresh via the HttpOnly cookie
    if (response.status === 401 && !options._retry) {
      options._retry = true;

      // If no user profile exists there is nothing to refresh for
      if (typeof window !== 'undefined' && !localStorage.getItem('user')) {
        forceLogout();
        return response;
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((newToken) => {
          fetchOptions.headers['Authorization'] = `Bearer ${newToken}`;
          return fetch(url, fetchOptions);
        });
      }

      isRefreshing = true;

      try {
        const ok = await silentRefresh();
        if (!ok) throw new Error('Silent refresh failed');

        processQueue(null, _accessToken);
        isRefreshing = false;

        fetchOptions.headers['Authorization'] = `Bearer ${_accessToken}`;
        return fetch(url, fetchOptions);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        isRefreshing = false;
        forceLogout();
        return response;
      }
    }

    return response;
  } catch (error) {
    throw error;
  }
}
