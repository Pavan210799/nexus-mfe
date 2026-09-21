export const USERS_KEY = "mfd-users";
export const SESSION_KEY = "mfd-session";
export const THEME_KEY = "mfd-theme";
export const NOTES_KEY = "mfd-notifications";

export function readJson(key, fallback) {
  const raw = localStorage.getItem(key);

  if (!raw) {
    return fallback;
  }

  return JSON.parse(raw);
}

export function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getUsers() {
  return readJson(USERS_KEY, []);
}

export function setUsers(users) {
  writeJson(USERS_KEY, users);
}

export function getSession() {
  return readJson(SESSION_KEY, null);
}

export function setSession(user) {
  writeJson(SESSION_KEY, user);
  window.dispatchEvent(new Event("session-changed"));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("session-changed"));
}

export function getTheme() {
  return localStorage.getItem(THEME_KEY) || "light";
}

export function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);

  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export function getNotifications() {
  return readJson(NOTES_KEY, []);
}

export function setNotifications(items) {
  writeJson(NOTES_KEY, items);
  window.dispatchEvent(new Event("notes-changed"));
}
