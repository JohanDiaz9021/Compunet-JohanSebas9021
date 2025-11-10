"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { FormField } from "@/components/FormField";

export default function LoginPage() {
  const { login, error } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!email || !password) {
      setFormError("Email y contraseña son requeridos");
      return;
    }
    try {
      setSubmitting(true);
      await login({ email, password });
      router.push("/events");
    } catch {
      // error shown from context
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Iniciar sesión</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <FormField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <FormField label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {formError && <p className="text-sm text-red-600">{formError}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={submitting} className="rounded bg-black text-white px-4 py-2 disabled:opacity-60">
          {submitting ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
