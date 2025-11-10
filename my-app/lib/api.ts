"use client";

// Declare a minimal process typing for client-side TS without @types/node
// eslint-disable-next-line no-var
declare var process: { env?: Record<string, string | undefined> };

import { ApiError, Event, ID, LoginRequest, LoginResponse, NewEventInput, Registration, UpdateEventInput, User } from "./types";

// Use a loose typing for process to avoid TS complaints in client modules
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const API_BASE = ((globalThis as any)?.process?.env?.NEXT_PUBLIC_API_BASE_URL ?? (process as any)?.env?.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

function buildUrl(path: string, query?: Record<string, string | undefined | null>) {
  const url = new URL(`${API_BASE}${path}`);
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
}

async function request<T>(path: string, opts: RequestInit = {}, token?: string): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers as Record<string, string> | undefined),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(buildUrl(path), {
    ...opts,
    headers,
    cache: "no-store",
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await res.json().catch(() => ({})) : await res.text();

  if (!res.ok) {
    const message = (isJson && (body?.message || body?.error)) || res.statusText;
    const error: ApiError = { status: res.status, message };
    throw error;
  }
  return body as T;
}

// Auth
export async function apiLogin(data: LoginRequest): Promise<LoginResponse> {
  return request<LoginResponse>(`/login`, { method: "POST", body: JSON.stringify(data) });
}

// Users
export async function apiCreateUser(data: Omit<User, "userId">, token: string): Promise<User> {
  return request<User>(`/users/`, { method: "POST", body: JSON.stringify(data) }, token);
}

export async function apiListUsers(token: string): Promise<User[]> {
  return request<User[]>(`/users/`, { method: "GET" }, token);
}

export async function apiGetUser(id: ID, token: string): Promise<User> {
  return request<User>(`/users/${id}`, { method: "GET" }, token);
}

// Events
export async function apiListEvents(params: { city?: string; from?: string; to?: string }, token: string): Promise<Event[]> {
  const url = buildUrl(`/events`, params);
  return request<Event[]>(url.replace(API_BASE, ""), { method: "GET" }, token);
}

export async function apiGetEvent(id: ID, token: string): Promise<Event> {
  return request<Event>(`/events/${id}`, { method: "GET" }, token);
}

export async function apiCreateEvent(input: NewEventInput, token: string): Promise<Event> {
  return request<Event>(`/events`, { method: "POST", body: JSON.stringify(input) }, token);
}

export async function apiUpdateEvent(id: ID, input: UpdateEventInput, token: string): Promise<Event> {
  return request<Event>(`/events/${id}`, { method: "PUT", body: JSON.stringify(input) }, token);
}

export async function apiDeleteEvent(id: ID, token: string): Promise<{ success: boolean }> {
  return request<{ success: boolean }>(`/events/${id}`, { method: "DELETE" }, token);
}

// Registrations
export async function apiCreateRegistration(eventId: ID, token: string): Promise<Registration> {
  return request<Registration>(`/registrations`, { method: "POST", body: JSON.stringify({ eventId }) }, token);
}

export async function apiListRegistrations(token: string): Promise<Registration[]> {
  return request<Registration[]>(`/registrations`, { method: "GET" }, token);
}

// Helpers
export function getParticipantsCount(e: Event): number | undefined {
  return (
    e.participantsCount ??
    e.registrationsCount ??
    (Array.isArray(e.participants) ? e.participants.length : undefined) ??
    (Array.isArray(e.registrations) ? e.registrations.length : undefined)
  );
}
