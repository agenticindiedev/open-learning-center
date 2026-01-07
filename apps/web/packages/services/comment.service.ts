import type { Comment, CreateCommentPayload } from "@interfaces/comment.interface";

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

export const CommentService = {
  async getByLessonId(lessonId: string): Promise<Comment[]> {
    const response = await fetch(`${API_URL}/comments?lessonId=${lessonId}`);
    return handleResponse<Comment[]>(response);
  },

  async create(payload: CreateCommentPayload): Promise<Comment> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/comments`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    return handleResponse<Comment>(response);
  },

  async delete(commentId: string): Promise<void> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/comments/${commentId}`, {
      method: "DELETE",
      headers,
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Failed to delete comment" }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }
  },
};
