"use client";
import { UserProfile } from "@/components/UserProfile";

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-3xl p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Perfil</h1>
      <UserProfile />
    </div>
  );
}
