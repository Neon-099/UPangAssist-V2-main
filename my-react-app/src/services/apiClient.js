const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL || "/api"
).replace(/\/$/, "");

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new Error(data?.error || "Request failed");
  }

  return data;
}

export { apiBaseUrl };