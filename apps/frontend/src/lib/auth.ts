const BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:3000";

export type AuthUser = { _id: string; email: string; name?: string };
export type AuthResponse = { token: string; user: AuthUser };

export async function register(
  email: string,
  name?: string
): Promise<AuthResponse> {
  const res = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, name }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function login(email: string): Promise<AuthResponse> {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
