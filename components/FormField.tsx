"use client";
import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | null;
}

export function FormField({ label, error, ...rest }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">{label}</label>
      <input
        {...rest}
        className={`rounded border px-3 py-2 text-sm bg-white dark:bg-black/40 ${error ? "border-red-500" : "border-black/20 dark:border-white/30"}`}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
