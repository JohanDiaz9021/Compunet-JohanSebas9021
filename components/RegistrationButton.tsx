"use client";
import { useState, useEffect } from "react";
import { apiCreateRegistration, apiListRegistrations } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export function RegistrationButton({ eventId }: { eventId: string }) {
  const { token } = useAuth();
  const [busy, setBusy] = useState(false);
  const [already, setAlready] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    apiListRegistrations(token)
      .then((regs) => setAlready(regs.some((r) => r.eventId === eventId)))
      .catch(() => {});
  }, [token, eventId]);

  const register = async () => {
    if (!token) {
      setMsg("Debes iniciar sesión");
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      await apiCreateRegistration(eventId, token);
      setAlready(true);
      setMsg("Inscripción exitosa");
    } catch (e: unknown) {
      const msg = e && typeof e === "object" && "message" in e ? String((e as any).message) : "Error al inscribirse";
      setMsg(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={register}
        disabled={busy || already}
        className="rounded bg-black text-white px-4 py-2 disabled:opacity-60"
      >
        {already ? "Ya inscrito" : busy ? "Inscribiendo..." : "Inscribirme"}
      </button>
      {msg && <span className="text-xs opacity-70">{msg}</span>}
    </div>
  );
}
