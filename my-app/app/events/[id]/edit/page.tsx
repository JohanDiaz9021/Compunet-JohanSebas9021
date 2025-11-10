"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { apiGetEvent, apiUpdateEvent } from "@/lib/api";
import { Event } from "@/lib/types";
import { EventForm } from "@/components/EventForm";

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const { token, user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    apiGetEvent(id, token)
      .then((ev) => {
        setEvent(ev);
        if (user && ev.createdBy !== user.userId) {
          setError("Solo el creador puede editar este evento");
        }
      })
      .catch((e) => setError(e.message || "Error cargando evento"))
      .finally(() => setLoading(false));
  }, [id, token, user]);

  const onSubmit = async (data: { name: string; description: string; date: string; city: string }) => {
    if (!token || !event) return;
    if (user && event.createdBy !== user.userId) {
      setError("No tienes permiso para editar este evento");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const updated = await apiUpdateEvent(event.eventId, data, token);
      router.push(`/events/${updated.eventId}`);
    } catch (e: any) {
      setError(e?.message || "Error al actualizar evento");
    } finally {
      setBusy(false);
    }
  };

  if (!token) return <p className="p-4">Debes iniciar sesión.</p>;
  if (loading) return <p className="p-4">Cargando...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!event) return <p className="p-4">No encontrado.</p>;

  return (
    <div className="mx-auto max-w-xl p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Editar evento</h1>
      <EventForm initial={event} onSubmit={onSubmit} submitting={busy} />
    </div>
  );
}
