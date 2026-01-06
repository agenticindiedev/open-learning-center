import { Event } from "@interfaces/event.interface";

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

export const EventService = {
  async getAll(): Promise<Event[]> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/events`, {
      headers,
    });
    return handleResponse<Event[]>(response);
  },

  async getAdminAll(): Promise<Event[]> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/events/admin`, {
      headers,
    });
    return handleResponse<Event[]>(response);
  },

  async getAdminById(id: string): Promise<Event> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/events/admin/${id}`, {
      headers,
    });
    return handleResponse<Event>(response);
  },

  async create(data: Partial<Event>): Promise<Event> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/events`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    return handleResponse<Event>(response);
  },

  async update(id: string, data: Partial<Event>): Promise<Event> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    });
    return handleResponse<Event>(response);
  },

  async delete(id: string): Promise<void> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: "DELETE",
      headers,
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Delete failed" }));
      throw new Error(error.message);
    }
  },
};
