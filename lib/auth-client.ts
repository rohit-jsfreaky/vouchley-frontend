/**
 * Thin auth client — every method is a fetch to FastAPI.
 * No Node-side secrets, no DB clients, no auth libraries.
 */
import { apiGet, apiGetServer, apiPost } from "./api";

export interface User {
  id: string;
  email: string;
  name: string | null;
  email_verified: boolean;
  credits_balance: number;
  created_at: string;
}

interface MeResponse {
  user: User;
}

interface AuthOkResponse {
  ok: boolean;
  email?: string | null;
}

// ---------------- signup / verify / login -----------------------------
export async function signup(input: {
  email: string;
  password: string;
  name?: string;
}): Promise<AuthOkResponse> {
  return apiPost<AuthOkResponse>("/auth/signup", input);
}

export async function resendOtp(email: string): Promise<AuthOkResponse> {
  return apiPost<AuthOkResponse>("/auth/send-otp", {
    email,
    purpose: "email_verification",
  });
}

export async function verifyEmailOtp(input: {
  email: string;
  otp: string;
}): Promise<User> {
  const { user } = await apiPost<MeResponse>("/auth/verify-otp", input);
  return user;
}

export async function loginWithPassword(input: {
  email: string;
  password: string;
}): Promise<User> {
  const { user } = await apiPost<MeResponse>("/auth/login", input);
  return user;
}

export async function logout(): Promise<void> {
  await apiPost<AuthOkResponse>("/auth/logout", {});
}

export function startGoogleLogin(): void {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  window.location.href = `${base}/auth/google/start`;
}

// ---------------- session reads ---------------------------------------
export async function getSessionClient(): Promise<User | null> {
  try {
    const { user } = await apiGet<MeResponse>("/auth/me");
    return user;
  } catch {
    return null;
  }
}

export async function getSessionServer(): Promise<User | null> {
  const res = await apiGetServer<MeResponse>("/auth/me");
  return res?.user ?? null;
}
