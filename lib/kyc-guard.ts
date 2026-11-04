const COOLDOWN_MS = 60_000;

const cooldownKey = (userId: string) => `kyc:cooldown:${userId}`;
const lastAttemptKey = (userId: string) => `kyc:lastAttempt:${userId}`;

type LastAttempt = { fingerprint: string; failedAt: number };

const safeStorage = () => (typeof window === 'undefined' ? null : window.localStorage);

export const getCooldownRemaining = (userId: string): number => {
  const storage = safeStorage();
  if (!storage) return 0;
  const until = Number(storage.getItem(cooldownKey(userId)) ?? 0);
  const remaining = until - Date.now();
  return remaining > 0 ? remaining : 0;
};

export const startCooldown = (userId: string) => {
  const storage = safeStorage();
  if (!storage) return;
  storage.setItem(cooldownKey(userId), String(Date.now() + COOLDOWN_MS));
};

export const fingerprintAttempt = (nin: string, dateOfBirth: string) =>
  `${nin.trim()}|${dateOfBirth.trim()}`;

export const recordFailedAttempt = (userId: string, fingerprint: string) => {
  const storage = safeStorage();
  if (!storage) return;
  const payload: LastAttempt = { fingerprint, failedAt: Date.now() };
  storage.setItem(lastAttemptKey(userId), JSON.stringify(payload));
};

export const wasJustFailed = (userId: string, fingerprint: string): boolean => {
  const storage = safeStorage();
  if (!storage) return false;
  const raw = storage.getItem(lastAttemptKey(userId));
  if (!raw) return false;
  try {
    const parsed = JSON.parse(raw) as LastAttempt;
    return parsed.fingerprint === fingerprint;
  } catch {
    return false;
  }
};

export const clearLastAttempt = (userId: string) => {
  const storage = safeStorage();
  if (!storage) return;
  storage.removeItem(lastAttemptKey(userId));
};
