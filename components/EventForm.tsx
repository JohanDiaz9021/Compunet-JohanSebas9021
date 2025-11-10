"use client";
import { useState } from "react";
import { FormField } from "@/components/FormField";
import { NewEventInput, Event } from "@/lib/types";
import { validateEventFields } from "@/lib/validation";

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
  const [errors, setErrors] = useState<string[]>([]);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setErrors([]);
    const isoDate = new Date(date).toISOString();
    const result = validateEventFields({ name, description, date: isoDate, city });
    if (!result.valid) {
      setErrors(result.errors);
      setError("Hay errores de validación");
      return;
    }
    await onSubmit({ name, description, date: isoDate, city });
  };

  return (
    <form onSubmit={handle} className="flex flex-col gap-4">
      <FormField label="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
      <FormField label="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} />
      <FormField label="Fecha" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
      <FormField label="Ciudad" value={city} onChange={(e) => setCity(e.target.value)} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!!errors.length && (
        <ul className="text-xs text-red-700 list-disc pl-5 space-y-1">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}
      <button disabled={submitting} className="rounded bg-black text-white px-4 py-2 disabled:opacity-60">
        {submitting ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}
