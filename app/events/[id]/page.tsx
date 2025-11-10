"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { apiDeleteEvent, apiGetEvent } from "@/lib/api";
import { Event } from "@/lib/types";
import { RegistrationButton } from "@/components/RegistrationButton";
import Link from "next/link";
import { format } from "date-fns";

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { token, user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!token) return;
  // eslint-disable-next-line react-hooks/set-state-in-effect
  setLoading(true);
    apiGetEvent(id, token)
      .then(setEvent)
      .catch((e) => setError(e.message || "Error cargando evento"))
      .finally(() => setLoading(false));
  }, [id, token]);

  const canEdit = user && event && user.userId === event.createdBy;

  const del = async () => {
    if (!token || !event) return;
    if (!confirm("¿Eliminar este evento?")) return;
    try {
      await apiDeleteEvent(event.eventId, token);
      router.push("/events");
    } catch (e: unknown) {
      const msg = e && typeof e === "object" && "message" in e ? String((e as any).message) : "Error al eliminar";
      setError(msg);
    }
  };

  if (!token) return <p className="p-4">Debes iniciar sesión.</p>;
  if (loading) return <p className="p-4">Cargando...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!event) return <p className="p-4">No encontrado.</p>;

  return (
    <div className="mx-auto max-w-2xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{event.name}</h1>
        {canEdit && (
          <div className="flex gap-2 text-sm">
            <Link href={`/events/${event.eventId}/edit`} className="rounded border px-2 py-1">Editar</Link>
            <button onClick={del} className="rounded border px-2 py-1">Eliminar</button>
          </div>
        )}
      </div>
      <p className="text-sm opacity-80 whitespace-pre-line">{event.description}</p>
      <div className="text-sm flex flex-col gap-1">
        <span>Ciudad: {event.city}</span>
        <span>Fecha: {format(new Date(event.date), "yyyy-MM-dd HH:mm")}</span>
        <span>Creador: {event.createdBy}</span>
      </div>
      <RegistrationButton eventId={event.eventId} />
    </div>
  );
}
