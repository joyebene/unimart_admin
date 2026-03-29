// lib/apiClient.ts
const BASE_URL = "https://unimart-app-backend.onrender.com/api/v1";

async function refreshToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("No refresh token available");

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) throw new Error("Failed to refresh token");

  const data = await res.json();
  localStorage.setItem("adminToken", data.data.accessToken);
  localStorage.setItem("refreshToken", data.data.refreshToken);
  return data.data.accessToken;
}

export async function apiRequest(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
  body?: any
) {
  const accessToken = localStorage.getItem("adminToken") || "";
  
  let res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  // If access token expired, try refreshing
  if (res.status === 401) {
    try {
      const newToken = await refreshToken();
      res = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${newToken}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch (err) {
      console.log(err);
      
      localStorage.removeItem("adminToken");
      localStorage.removeItem("refreshToken");
      throw new Error("Session expired. Please login again.");
    }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || "API request failed");
  }

  return res.json();
}