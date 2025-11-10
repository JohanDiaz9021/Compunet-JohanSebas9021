"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { apiListEvents } from "@/lib/api";
import { Event } from "@/lib/types";
import { EventFilters, EventFilterValues } from "@/components/EventFilters";
import { EventList } from "@/components/EventList";

export default function EventsPage() {
  const { token } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<EventFilterValues>({});
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    apiListEvents(filters, token)
      .then(setEvents)
      .catch((e) => setError(e.message || "Error cargando eventos"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, JSON.stringify(filters)]);

  return (
    <div className="mx-auto max-w-4xl p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Eventos</h1>
      <EventFilters onChange={setFilters} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      {loading ? <p className="text-sm opacity-70">Cargando...</p> : <EventList events={events} />}
    </div>
  );
}
