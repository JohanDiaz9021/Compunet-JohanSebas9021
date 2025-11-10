"use client";
import { useState } from "react";

export interface EventFilterValues {
  city?: string;
  from?: string; // date ISO or date-local
  to?: string;
}

export function EventFilters({ onChange }: { onChange: (v: EventFilterValues) => void }) {
  const [city, setCity] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const apply = () => {
    onChange({ city: city || undefined, from: from || undefined, to: to || undefined });
  };

  return (
    <div className="flex flex-wrap gap-3 items-end border rounded p-3 bg-white/50 dark:bg-black/30">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium">Ciudad</label>
        <input value={city} onChange={(e) => setCity(e.target.value)} className="rounded border px-2 py-1 text-sm" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium">Desde</label>
        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="rounded border px-2 py-1 text-sm" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium">Hasta</label>
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="rounded border px-2 py-1 text-sm" />
      </div>
      <button type="button" onClick={apply} className="h-9 rounded bg-black text-white px-4 text-sm">Filtrar</button>
    </div>
  );
}
