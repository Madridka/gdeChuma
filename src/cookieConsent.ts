import { ref } from "vue";
import { privacy } from "./data/privacy";

export type CookieChoice = "accepted" | "rejected";
interface ConsentRecord {
  choice: CookieChoice;
  version: string;
  updatedAt: number;
  expiresAt: number;
}

const storageKey = "gdechuma:cookie-consent";
const lifetime = privacy.consentDays * 24 * 60 * 60 * 1000;

function readRecord(): ConsentRecord | null {
  try {
    const record = JSON.parse(localStorage.getItem(storageKey) ?? "null");
    if (
      !record ||
      !["accepted", "rejected"].includes(record.choice) ||
      record.version !== privacy.consentVersion ||
      !Number.isFinite(record.updatedAt) ||
      record.updatedAt > Date.now() ||
      !Number.isFinite(record.expiresAt) ||
      record.expiresAt <= Date.now() ||
      record.expiresAt > record.updatedAt + lifetime
    ) return null;
    return record;
  } catch {
    // Unavailable or invalid storage never counts as permission to track.
    return null;
  }
}

let currentRecord = readRecord();
export const cookieChoice = ref<CookieChoice | null>(currentRecord?.choice ?? null);
export const cookieSettingsOpen = ref(cookieChoice.value === null);
let expiryTimer: ReturnType<typeof setTimeout> | undefined;

export function hasAnalyticsConsent() {
  return cookieChoice.value === "accepted" &&
    currentRecord !== null && currentRecord.expiresAt > Date.now();
}

export function openCookieSettings() {
  cookieSettingsOpen.value = true;
}

export function closeCookieSettings() {
  if (cookieChoice.value !== null) cookieSettingsOpen.value = false;
}

function scheduleExpiry() {
  if (expiryTimer) clearTimeout(expiryTimer);
  if (!currentRecord) return;
  // Browser timers accept at most a signed 32-bit delay. Recheck long lifetimes.
  expiryTimer = setTimeout(() => {
    if (currentRecord && currentRecord.expiresAt <= Date.now()) {
      currentRecord = null;
      try { localStorage.removeItem(storageKey); } catch { /* No storage access. */ }
      cookieChoice.value = null;
      cookieSettingsOpen.value = true;
    } else {
      scheduleExpiry();
    }
  }, Math.min(currentRecord.expiresAt - Date.now(), 2_147_483_647));
}

export function setCookieConsent(choice: CookieChoice) {
  const now = Date.now();
  currentRecord = {
    choice,
    version: privacy.consentVersion,
    updatedAt: now,
    expiresAt: now + lifetime,
  };
  try { localStorage.setItem(storageKey, JSON.stringify(currentRecord)); } catch {
    // Keep the choice for this page only if the browser blocks storage.
  }
  cookieChoice.value = choice;
  cookieSettingsOpen.value = false;
  scheduleExpiry();
}

export function startConsentSync() {
  scheduleExpiry();
  window.addEventListener("storage", (event) => {
    if (event.key !== storageKey && event.key !== null) return;
    currentRecord = readRecord();
    cookieChoice.value = currentRecord?.choice ?? null;
    cookieSettingsOpen.value = cookieChoice.value === null;
    scheduleExpiry();
  });
}
