import type { Achievement, AchievementWithStatus } from "@interfaces/achievement.interface";
import type { IRequestOptions } from "@interfaces/request-options.interface";
import type { UserAchievement } from "@interfaces/user-achievement.interface";

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

export const AchievementService = {
  async getAll(options?: IRequestOptions): Promise<Achievement[]> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/achievements`, {
      headers,
      signal: options?.signal,
    });
    return handleResponse<Achievement[]>(response);
  },

  async getBySlug(slug: string, options?: IRequestOptions): Promise<Achievement> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/achievements/${slug}`, {
      headers,
      signal: options?.signal,
    });
    return handleResponse<Achievement>(response);
  },

  async getAllWithStatus(options?: IRequestOptions): Promise<AchievementWithStatus[]> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/achievements/my`, {
      headers,
      signal: options?.signal,
    });
    return handleResponse<AchievementWithStatus[]>(response);
  },

  async getEarned(options?: IRequestOptions): Promise<UserAchievement[]> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/achievements/my/earned`, {
      headers,
      signal: options?.signal,
    });
    return handleResponse<UserAchievement[]>(response);
  },

  async getRecent(limit = 5, options?: IRequestOptions): Promise<UserAchievement[]> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/achievements/my/recent?limit=${limit}`, {
      headers,
      signal: options?.signal,
    });
    return handleResponse<UserAchievement[]>(response);
  },
};
