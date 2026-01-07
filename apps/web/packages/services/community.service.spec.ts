import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CommunityService } from "./community.service";

const API_URL = "http://localhost:3001";

describe("CommunityService", () => {
  const mockToken = "mock-token";
  const mockCommunity = {
    _id: "community-1",
    title: "Test Community",
    slug: "test-community",
    description: "A test community",
    isFree: false,
    isPublished: true,
    isFeatured: false,
    sortOrder: 0,
  };

  beforeEach(() => {
    vi.stubGlobal("window", {
      Clerk: {
        session: {
          getToken: vi.fn().mockResolvedValue(mockToken),
        },
      },
    });
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("getAll", () => {
    it("should fetch all communities", async () => {
      const mockCommunities = [mockCommunity];
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockCommunities),
      } as Response);

      const result = await CommunityService.getAll();

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/communities`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
        },
        signal: undefined,
      });
      expect(result).toEqual(mockCommunities);
    });

    it("should pass abort signal when provided", async () => {
      const controller = new AbortController();
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
      } as Response);

      await CommunityService.getAll({ signal: controller.signal });

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/communities`, {
        headers: expect.any(Object),
        signal: controller.signal,
      });
    });
  });

  describe("getBySlug", () => {
    it("should fetch community by slug", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockCommunity),
      } as Response);

      const result = await CommunityService.getBySlug("test-community");

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/communities/slug/test-community`, {
        headers: expect.any(Object),
        signal: undefined,
      });
      expect(result).toEqual(mockCommunity);
    });
  });

  describe("getAdminAll", () => {
    it("should fetch all communities for admin", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([mockCommunity]),
      } as Response);

      const result = await CommunityService.getAdminAll();

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/communities/admin`, {
        headers: expect.any(Object),
        signal: undefined,
      });
      expect(result).toEqual([mockCommunity]);
    });
  });

  describe("getAdminById", () => {
    it("should fetch community by id for admin", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockCommunity),
      } as Response);

      const result = await CommunityService.getAdminById("community-1");

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/communities/admin/community-1`, {
        headers: expect.any(Object),
        signal: undefined,
      });
      expect(result).toEqual(mockCommunity);
    });
  });

  describe("create", () => {
    it("should create a community", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockCommunity),
      } as Response);

      const data = { title: "Test Community", slug: "test-community" };
      const result = await CommunityService.create(data);

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/communities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
        },
        body: JSON.stringify(data),
      });
      expect(result).toEqual(mockCommunity);
    });
  });

  describe("update", () => {
    it("should update a community", async () => {
      const updatedCommunity = { ...mockCommunity, title: "Updated Community" };
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(updatedCommunity),
      } as Response);

      const data = { title: "Updated Community" };
      const result = await CommunityService.update("community-1", data);

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/communities/community-1`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
        },
        body: JSON.stringify(data),
      });
      expect(result).toEqual(updatedCommunity);
    });
  });

  describe("delete", () => {
    it("should delete a community", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
      } as Response);

      await CommunityService.delete("community-1");

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/communities/community-1`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
        },
      });
    });

    it("should throw error on failed delete", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ message: "Not authorized" }),
      } as Response);

      await expect(CommunityService.delete("community-1")).rejects.toThrow("Not authorized");
    });

    it("should throw generic error when json parsing fails", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        json: () => Promise.reject(new Error("Parse error")),
      } as Response);

      await expect(CommunityService.delete("community-1")).rejects.toThrow("Delete failed");
    });
  });

  describe("error handling", () => {
    it("should throw error with message from response", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: "Bad request" }),
      } as Response);

      await expect(CommunityService.getAll()).rejects.toThrow("Bad request");
    });

    it("should throw HTTP status error when no message", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      } as Response);

      await expect(CommunityService.getAll()).rejects.toThrow("HTTP 500");
    });
  });
});
