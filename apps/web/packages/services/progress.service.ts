import { Progress } from "@interfaces/progress.interface";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await window.Clerk?.session?.getToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  return response.json();
}

export const ProgressService = {
  async upsert(lessonId: string, completedAt?: string): Promise<Progress> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/progress`, {
      method: "POST",
      headers,
      body: JSON.stringify({ lessonId, completedAt }),
    });
    return handleResponse<Progress>(response);
  },

  async getMine(): Promise<Progress[]> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/progress/me`, {
      headers,
    });
    return handleResponse<Progress[]>(response);
  },
};
