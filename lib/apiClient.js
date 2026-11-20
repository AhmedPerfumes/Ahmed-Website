/**
 * Centralized API Client with JWT Bearer Token Auto-Injection
 * & Automatic 401 Silent Token Refresh (CORS-friendly, no cookies required).
 *
 * Token storage strategy:
 *   - Access token  → in-memory module variable + sessionStorage fallback
 *   - Refresh token → localStorage (passed in request body on /api/refresh)
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

// ── In-memory & storage access token store ────────────────────────────────────
let _accessToken = null;
let isRefreshing = false;
let failedQueue = [];

export const setAccessToken = (token) => { 
  _accessToken = token; 
};

export const getAccessToken = () => _accessToken;

export const setRefreshToken = (token) => {
  if (typeof window !== 'undefined' && token) {
    localStorage.setItem('refresh_token', token);
  }
};

export const getRefreshToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refresh_token');
  }
  return null;
};

export const setAuthTokens = ({ access_token, refresh_token }) => {
  if (access_token) setAccessToken(access_token);
  if (refresh_token) setRefreshToken(refresh_token);
};

export const clearAccessToken = () => { _accessToken = null; };

// Backward-compatible alias used by UserContext / other consumers
export const getStoredToken = () => _accessToken;

// ── Auth token helpers ─────────────────────────────────────────────────────────
/**
 * Clear in-memory access token, refresh token, and non-sensitive localStorage data.
 */
export const clearStoredTokens = () => {
  _accessToken = null;
  if (typeof window === 'undefined') return;
  localStorage.removeItem('user');
  localStorage.removeItem('address');
  localStorage.removeItem('token');
  localStorage.removeItem('refresh_token');
};

/**
 * Force logout: clear tokens + profile data, then notify the app.
 */
export const forceLogout = () => {
  if (typeof window === 'undefined') return;
  clearStoredTokens();
  window.dispatchEvent(new Event('user-logged-out'));
};

// ── Silent refresh (Payload-based, no cookies required) ───────────────────────
/**
 * Call POST /api/refresh with JSON payload containing refresh_token.
 * Returns true on success.
 */
export async function silentRefresh() {
  const storedRefreshToken = getRefreshToken();
  if (!storedRefreshToken) return false;

  try {
    const res = await fetch(`${API_BASE}api/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: storedRefreshToken }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (data.access_token) {
      _accessToken = data.access_token;
      if (data.refresh_token) {
        setRefreshToken(data.refresh_token);
      }
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
    headers,
  };

  try {
    let response = await fetch(url, fetchOptions);

    // On 401 attempt one silent refresh via the refresh token
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
