"use client";
import { useState } from "react";
import { FormField } from "@/components/FormField";
import { NewEventInput, Event } from "@/lib/types";

interface Props {
  initial?: Event | null;
  onSubmit: (data: NewEventInput) => Promise<void>;
  submitting?: boolean;
}

export function EventForm({ initial, onSubmit, submitting }: Props) {
  const [name, setName] = useState(initial?.name || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [date, setDate] = useState(() => {
    if (initial?.date) {
      try {
        const d = new Date(initial.date);
        return d.toISOString().slice(0, 16);
      } catch {
        return "";
      }
    }
    return "";
  });
  const [city, setCity] = useState(initial?.city || "");
  const [error, setError] = useState<string | null>(null);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name || !description || !date || !city) {
      setError("Todos los campos son requeridos");
      return;
    }
    const isoDate = new Date(date).toISOString();
    await onSubmit({ name, description, date: isoDate, city });
  };

  return (
    <form onSubmit={handle} className="flex flex-col gap-4">
      <FormField label="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
      <FormField label="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} />
      <FormField label="Fecha" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
      <FormField label="Ciudad" value={city} onChange={(e) => setCity(e.target.value)} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button disabled={submitting} className="rounded bg-black text-white px-4 py-2 disabled:opacity-60">
        {submitting ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}
