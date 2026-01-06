import { Subscription } from "@interfaces/subscription.interface";
import type { IBillingCheckoutResponse } from "@interfaces/billing.interface";

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

export const SubscriptionService = {
  async getMine(): Promise<Subscription[]> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/subscriptions/me`, {
      headers,
    });
    return handleResponse<Subscription[]>(response);
  },

  async createCheckout(): Promise<IBillingCheckoutResponse> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/billing/checkout`, {
      method: "POST",
      headers,
    });
    return handleResponse<IBillingCheckoutResponse>(response);
  },
};
