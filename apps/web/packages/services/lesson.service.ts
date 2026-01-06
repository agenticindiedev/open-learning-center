import { Lesson } from "@interfaces/lesson.interface";
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

export const LessonService = {
  async getAll(courseId: string, options?: IRequestOptions): Promise<Lesson[]> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/lessons?courseId=${courseId}`, {
      headers,
      signal: options?.signal,
    });
    return handleResponse<Lesson[]>(response);
  },

  async getBySlug(slug: string, options?: IRequestOptions): Promise<Lesson> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/lessons/slug/${slug}`, {
      headers,
      signal: options?.signal,
    });
    return handleResponse<Lesson>(response);
  },

  async getAdminAll(
    courseId?: string,
    options?: IRequestOptions,
  ): Promise<Lesson[]> {
    const headers = await getAuthHeaders();
    const query = courseId ? `?courseId=${courseId}` : "";
    const response = await fetch(`${API_URL}/lessons/admin${query}`, {
      headers,
      signal: options?.signal,
    });
    return handleResponse<Lesson[]>(response);
  },

  async getAdminById(id: string, options?: IRequestOptions): Promise<Lesson> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/lessons/admin/${id}`, {
      headers,
      signal: options?.signal,
    });
    return handleResponse<Lesson>(response);
  },

  async create(data: Partial<Lesson>): Promise<Lesson> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/lessons`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    return handleResponse<Lesson>(response);
  },

  async update(id: string, data: Partial<Lesson>): Promise<Lesson> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/lessons/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    });
    return handleResponse<Lesson>(response);
  },

  async delete(id: string): Promise<void> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/lessons/${id}`, {
      method: "DELETE",
      headers,
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Delete failed" }));
      throw new Error(error.message);
    }
  },
};
