"use client";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { apiCreateUser } from "@/lib/api";
import { FormField } from "@/components/FormField";
import { validateNewUser } from "@/lib/validation";

export default function NewUserPage() {
  const { token } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMsg(null);
    setErrors([]);
    if (!token) {
      setError("Debes iniciar sesión para crear usuarios");
      return;
    }
    const result = validateNewUser({ name, email, city, password });
    if (!result.valid) {
      setErrors(result.errors);
      setError("Hay errores de validación");
      return;
    }
    setBusy(true);
    try {
      await apiCreateUser({ name, email, city, password }, token);
      setMsg("Usuario creado");
      setName("");
      setEmail("");
      setCity("");
      setPassword("");
    } catch (e: unknown) {
      const msg = e && typeof e === "object" && "message" in e ? String((e as any).message) : "Error creando usuario";
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-md p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Nuevo usuario</h1>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <FormField label="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
        <FormField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <FormField label="Ciudad" value={city} onChange={(e) => setCity(e.target.value)} />
        <FormField label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!!errors.length && (
          <ul className="text-xs text-red-700 list-disc pl-5 space-y-1">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        )}
        {msg && <p className="text-sm text-green-700">{msg}</p>}
        <button disabled={busy} className="rounded bg-black text-white px-4 py-2 disabled:opacity-60">
          {busy ? "Creando..." : "Crear"}
        </button>
      </form>
    </div>
  );
}
