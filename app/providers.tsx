"use client";
import Link from "next/link";
import { AuthProvider, useAuth } from "@/lib/auth-context";

function NavBar() {
  const { token, user, logout } = useAuth();
  return (
    <header className="w-full border-b border-black/10 dark:border-white/20">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-4">
        <Link href="/" className="font-semibold">Eventos</Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/events">Lista</Link>
          <Link href="/events/create">Crear</Link>
          <Link href="/profile">Perfil</Link>
          <Link href="/users/new">Nuevo usuario</Link>
        </nav>
        <div className="ml-auto flex items-center gap-2 text-sm">
          {token ? (
            <>
              <span className="opacity-70">{user?.name ?? "Autenticado"}</span>
              <button onClick={logout} className="rounded border px-2 py-1">Salir</button>
            </>
          ) : (
            <Link href="/login" className="rounded border px-2 py-1">Iniciar sesión</Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <NavBar />
      {children}
    </AuthProvider>
  );
}
