/**
 * Cliente HTTP base para comunicación con el backend REST.
 * Los endpoints son configurables para facilitar la conexión con el backend real.
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("focus_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Error de conexión" }));
    throw new Error(error.message || `Error ${response.status}`);
  }

  return response.json();
}
