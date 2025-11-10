"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { apiCreateEvent } from "@/lib/api";
import { EventForm } from "@/components/EventForm";

export default function CreateEventPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: { name: string; description: string; date: string; city: string }) => {
    if (!token) {
      setError("Debes iniciar sesión");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const ev = await apiCreateEvent(data, token);
      router.push(`/events/${ev.eventId}`);
    } catch (e: any) {
      setError(e?.message || "Error al crear evento");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Crear evento</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <EventForm onSubmit={onSubmit} submitting={busy} />
    </div>
  );
}
