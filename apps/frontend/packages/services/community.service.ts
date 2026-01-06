import { Community } from "@interfaces/community.interface";
import type { IRequestOptions } from "@interfaces/request-options.interface";

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

export const CommunityService = {
  async getAll(options?: IRequestOptions): Promise<Community[]> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/communities`, {
      headers,
      signal: options?.signal,
    });
    return handleResponse<Community[]>(response);
  },

  async getBySlug(slug: string, options?: IRequestOptions): Promise<Community> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/communities/slug/${slug}`, {
      headers,
      signal: options?.signal,
    });
    return handleResponse<Community>(response);
  },

  async getAdminAll(options?: IRequestOptions): Promise<Community[]> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/communities/admin`, {
      headers,
      signal: options?.signal,
    });
    return handleResponse<Community[]>(response);
  },

  async getAdminById(id: string, options?: IRequestOptions): Promise<Community> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/communities/admin/${id}`, {
      headers,
      signal: options?.signal,
    });
    return handleResponse<Community>(response);
  },

  async create(data: Partial<Community>): Promise<Community> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/communities`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    return handleResponse<Community>(response);
  },

  async update(id: string, data: Partial<Community>): Promise<Community> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/communities/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    });
    return handleResponse<Community>(response);
  },

  async delete(id: string): Promise<void> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/communities/${id}`, {
      method: "DELETE",
      headers,
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Delete failed" }));
      throw new Error(error.message);
    }
  },
};
