export type ID = string;

export interface User {
  userId: ID;
  name: string;
  email: string;
  city: string;
  password?: string; // present only on create
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user?: User; // assuming backend might return it; optional fallback
}

export interface Event {
  eventId: ID;
  name: string;
  description: string;
  date: string; // ISO string
  city: string;
  createdBy: ID;
  // Optional fields depending on backend response
  participantsCount?: number;
  registrationsCount?: number;
  participants?: Array<{ userId: ID } | User>;
  registrations?: Array<{ userId: ID } | Registration>;
}

export interface NewEventInput {
  name: string;
  description: string;
  date: string; // ISO string
  city: string;
}

export type UpdateEventInput = Partial<NewEventInput>;

export interface Registration {
  regId: ID;
  eventId: ID;
  userId: ID;
  registeredAt: string; // ISO
}

export interface ApiError {
  status: number;
  message: string;
}
