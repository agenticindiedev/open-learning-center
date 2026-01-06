import { Membership } from "@interfaces/membership.interface";

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

export const MembershipService = {
  async join(communityId: string): Promise<Membership> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/memberships`, {
      method: "POST",
      headers,
      body: JSON.stringify({ communityId }),
    });
    return handleResponse<Membership>(response);
  },

  async getMine(): Promise<Membership[]> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/memberships/me`, {
      headers,
    });
    return handleResponse<Membership[]>(response);
  },
};
