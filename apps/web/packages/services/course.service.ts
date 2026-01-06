import { Course } from "@interfaces/course.interface";
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

export const CourseService = {
  async getAll(communityId?: string, options?: IRequestOptions): Promise<Course[]> {
    const headers = await getAuthHeaders();
    const query = communityId ? `?communityId=${communityId}` : "";
    const response = await fetch(`${API_URL}/courses${query}`, {
      headers,
      signal: options?.signal,
    });
    return handleResponse<Course[]>(response);
  },

  async getBySlug(slug: string, options?: IRequestOptions): Promise<Course> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/courses/slug/${slug}`, {
      headers,
      signal: options?.signal,
    });
    return handleResponse<Course>(response);
  },

  async getAdminAll(
    communityId?: string,
    options?: IRequestOptions,
  ): Promise<Course[]> {
    const headers = await getAuthHeaders();
    const query = communityId ? `?communityId=${communityId}` : "";
    const response = await fetch(`${API_URL}/courses/admin${query}`, {
      headers,
      signal: options?.signal,
    });
    return handleResponse<Course[]>(response);
  },

  async getAdminById(id: string, options?: IRequestOptions): Promise<Course> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/courses/admin/${id}`, {
      headers,
      signal: options?.signal,
    });
    return handleResponse<Course>(response);
  },

  async create(data: Partial<Course>): Promise<Course> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/courses`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    return handleResponse<Course>(response);
  },

  async update(id: string, data: Partial<Course>): Promise<Course> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/courses/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    });
    return handleResponse<Course>(response);
  },

  async delete(id: string): Promise<void> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/courses/${id}`, {
      method: "DELETE",
      headers,
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Delete failed" }));
      throw new Error(error.message);
    }
  },
};
