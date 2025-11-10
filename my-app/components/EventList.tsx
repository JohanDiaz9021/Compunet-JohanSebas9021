"use client";
import Link from "next/link";
import { Event } from "@/lib/types";
import { getParticipantsCount } from "@/lib/api";
import { format } from "date-fns";

export function EventList({ events }: { events: Event[] }) {
  if (!events.length) return <p className="text-sm opacity-70">No hay eventos.</p>;
  return (
    <ul className="space-y-3">
      {events.map((e) => (
        <li key={e.eventId} className="rounded border p-3 bg-white dark:bg-black/30 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <Link href={`/events/${e.eventId}`} className="font-medium hover:underline">
              {e.name}
            </Link>
            <span className="text-xs opacity-60">{format(new Date(e.date), "yyyy-MM-dd HH:mm")}</span>
          </div>
          <p className="text-xs opacity-80 line-clamp-2">{e.description}</p>
          <div className="text-xs flex gap-3 opacity-70">
            <span>{e.city}</span>
            <span>Participantes: {getParticipantsCount(e) ?? "?"}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
