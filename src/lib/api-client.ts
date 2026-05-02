/**
 *  TYPE-SAFE API CLIENT
 * 
 * Provides a hardened wrapper around fetch to ensure all network requests
 * are strictly typed and handle errors deterministically.
 */

export async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || `API Error: ${res.status} ${res.statusText}`);
  }

  // If 204 No Content, return empty object cast to T
  if (res.status === 204) return {} as T;

  return res.json() as Promise<T>;
}
