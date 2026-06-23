import { cookies } from "next/headers";

const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://localhost:8000";

export async function fetchBackend(endpoint: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const token =
    cookieStore.get("authjs.session-token")?.value ||
    cookieStore.get("__Secure-authjs.session-token")?.value;

  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  headers.set("Content-Type", "application/json");

  const url = `${AI_SERVICE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
}
