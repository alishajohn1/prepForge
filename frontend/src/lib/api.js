const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('prepforge_token');
};

const apiFetch = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let res;
  try {
    res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch {
    // Free-tier backends sleep when idle; the first request can take ~30-60s
    throw new Error('Cannot reach the server. It may be waking up — please try again in a moment.');
  }

  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && typeof window !== 'undefined' && token) {
    localStorage.removeItem('prepforge_token');
  }
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
};

// Auth
export const login = (email, password) =>
  apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

export const register = (username, email, password) =>
  apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify({ username, email, password }) });

export const getMe = () => apiFetch('/api/auth/me');

export const updateDailyGoal = (daily_goal) =>
  apiFetch('/api/auth/daily-goal', { method: 'PATCH', body: JSON.stringify({ daily_goal }) });

// Problems
export const getProblems = (params = {}) => {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v && v !== 'All'))
  ).toString();
  return apiFetch(`/api/problems${qs ? '?' + qs : ''}`);
};

export const getTopics = () => apiFetch('/api/problems/topics');

export const updateProblemStatus = (problemId, status, notes) =>
  apiFetch(`/api/problems/${problemId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, notes }),
  });

// Analytics
export const getDashboardStats = () => apiFetch('/api/analytics/dashboard');
export const getHeatmap = (months = 12) => apiFetch(`/api/analytics/heatmap?months=${months}`);
export const getWeakTopics = () => apiFetch('/api/analytics/weak-topics');
export const getRevisionList = () => apiFetch('/api/analytics/revision');
