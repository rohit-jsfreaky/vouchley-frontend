/**
 * Tiny wrapper around posthog-js so callers don't have to null-check.
 * Safe to call from anywhere — no-op on the server or before init.
 */
import posthog from "posthog-js";

function isReady(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean((posthog as unknown as { __loaded?: boolean }).__loaded);
}

export function trackEvent(
  name: string,
  properties?: Record<string, unknown>,
): void {
  if (!isReady()) return;
  posthog.capture(name, properties);
}

/** Tie subsequent events to a specific user. Call after login succeeds. */
export function identifyUser(
  userId: string,
  traits?: Record<string, unknown>,
): void {
  if (!isReady()) return;
  posthog.identify(userId, traits);
}

/** Wipe identity. Call after logout so the next session is anonymous. */
export function resetAnalytics(): void {
  if (!isReady()) return;
  posthog.reset();
}

/**
 * Canonical event names so we don't end up with `signup_complete` and
 * `signup_completed` in PostHog. Add new events here, reference everywhere.
 */
export const Events = {
  SignupCompleted: "signup_completed",
  LoginCompleted: "login_completed",
  Logout: "logout",
  ApiKeyCreated: "api_key_created",
  ApiKeyRevoked: "api_key_revoked",
  CheckoutStarted: "checkout_started",
  CheckoutCompleted: "checkout_completed",
  ContactFormSubmitted: "contact_form_submitted",
} as const;
