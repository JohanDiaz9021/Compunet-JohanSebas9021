"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { apiGetEvent, apiListRegistrations } from "@/lib/api";
import { Event, Registration } from "@/lib/types";
import Link from "next/link";

export function UserProfile() {
  const { user, token } = useAuth();
  const [regs, setRegs] = useState<Registration[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!token) return;
  // eslint-disable-next-line react-hooks/set-state-in-effect
  setLoading(true);
    apiListRegistrations(token)
      .then(async (r) => {
        setRegs(r);
        const evs: Event[] = [];
        for (const reg of r) {
          try {
            const ev = await apiGetEvent(reg.eventId, token);
            evs.push(ev);
          } catch {}
        }
        setEvents(evs);
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (!token) return <p className="text-sm">Debes iniciar sesión.</p>;

  return (
    <div className="space-y-4">
      <div className="rounded border p-3">
        <h2 className="font-semibold mb-2">Perfil</h2>
        <div className="text-sm">
          <div>Nombre: {user?.name}</div>
          <div>Email: {user?.email}</div>
          <div>Ciudad: {user?.city}</div>
        </div>
      </div>
      <div className="rounded border p-3">
        <h2 className="font-semibold mb-2">Eventos a los que te uniste</h2>
        {loading ? (
          <p className="text-sm opacity-70">Cargando...</p>
        ) : events.length ? (
          <ul className="list-disc pl-5 text-sm space-y-1">
            {events.map((e) => (
              <li key={e.eventId}>
                <Link href={`/events/${e.eventId}`} className="hover:underline">
                  {e.name} — {e.city}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm opacity-70">No te has inscrito a eventos.</p>
        )}
      </div>
    </div>
  );
}
