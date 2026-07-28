export function getAuthToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("authToken");
}

export function getAuthRole() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("authRole");
}

export function getAuthUser() {
  if (typeof window === "undefined") return null;

  const rawUser = window.localStorage.getItem("authUser");
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as { _id?: string; id?: string };
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getAuthToken());
}

export function clearAuth() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("authToken");
  window.localStorage.removeItem("authUser");
  window.localStorage.removeItem("authRole");
}
