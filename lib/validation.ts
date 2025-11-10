// Simple client-side validation helpers for forms.
// These are intentionally lightweight for the academic exercise.

export function isEmail(value: string): boolean {
  return /^(?:[A-Z0-9._%+-]+)@(?:[A-Z0-9-]+\.)+[A-Z]{2,}$/i.test(value.trim());
}

export function isStrongPassword(value: string): boolean {
  // Min 8 chars, at least one letter and one number
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-={}[\]|:;"'<>,.?/]{8,}$/.test(value);
}

export function isFutureDate(isoOrLocal: string): boolean {
  if (!isoOrLocal) return false;
  try {
    const d = new Date(isoOrLocal);
    return d.getTime() > Date.now();
  } catch {
    return false;
  }
}

export function required(value: string | undefined | null): boolean {
  return !!value && value.trim() !== "";
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateEventFields(data: { name: string; description: string; date: string; city: string }): ValidationResult {
  const errors: string[] = [];
  if (!required(data.name)) errors.push("Nombre es requerido");
  if (data.name && data.name.length < 3) errors.push("Nombre debe tener al menos 3 caracteres");
  if (!required(data.description)) errors.push("Descripción es requerida");
  if (data.description && data.description.length < 10) errors.push("Descripción muy corta (>=10)");
  if (!required(data.city)) errors.push("Ciudad es requerida");
  if (!required(data.date)) errors.push("Fecha es requerida");
  else if (!isFutureDate(data.date)) errors.push("Fecha debe ser futura");
  return { valid: errors.length === 0, errors };
}

export function validateNewUser(data: { name: string; email: string; city: string; password: string }): ValidationResult {
  const errors: string[] = [];
  if (!required(data.name)) errors.push("Nombre es requerido");
  if (data.name && data.name.length < 3) errors.push("Nombre mínimo 3 caracteres");
  if (!required(data.email)) errors.push("Email es requerido");
  else if (!isEmail(data.email)) errors.push("Email inválido");
  if (!required(data.city)) errors.push("Ciudad es requerida");
  if (!required(data.password)) errors.push("Contraseña es requerida");
  else if (!isStrongPassword(data.password)) errors.push("Contraseña debe tener mínimo 8 caracteres y 1 número");
  return { valid: errors.length === 0, errors };
}

export function validateLogin(data: { email: string; password: string }): ValidationResult {
  const errors: string[] = [];
  if (!required(data.email)) errors.push("Email es requerido");
  else if (!isEmail(data.email)) errors.push("Email inválido");
  if (!required(data.password)) errors.push("Contraseña es requerida");
  return { valid: errors.length === 0, errors };
}
