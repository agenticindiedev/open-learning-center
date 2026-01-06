import { describe, it, expect, beforeEach, vi } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { NotFoundException } from "@nestjs/common";
import { CommunitiesService } from "./communities.service";
import { Community } from "./schemas/community.schema";

const createMockModel = () => ({
  find: vi.fn(),
  findOne: vi.fn(),
  findById: vi.fn(),
  findByIdAndUpdate: vi.fn(),
  deleteOne: vi.fn(),
});

describe("CommunitiesService", () => {
  let service: CommunitiesService;
  let mockModel: ReturnType<typeof createMockModel>;

  beforeEach(async () => {
    mockModel = createMockModel();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommunitiesService,
        {
          provide: getModelToken(Community.name),
          useValue: {
            ...mockModel,
            new: vi.fn().mockImplementation((data) => ({
              ...data,
              save: vi.fn().mockResolvedValue({ ...data, _id: "new-id" }),
            })),
          },
        },
      ],
    }).compile();

    service = module.get<CommunitiesService>(CommunitiesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should list published communities", async () => {
    const community = { _id: "1", title: "Test", slug: "test" };
    mockModel.find.mockReturnValue({
      sort: vi.fn().mockResolvedValue([community]),
    });

    const result = await service.findPublished();

    expect(result).toEqual([community]);
    expect(mockModel.find).toHaveBeenCalledWith({ isPublished: true });
  });

  it("should throw when community slug not found", async () => {
    mockModel.findOne.mockResolvedValue(null);

    await expect(service.findBySlug("missing"))
      .rejects
      .toThrow(NotFoundException);
  });

  it("should update community", async () => {
    const updated = { _id: "1", title: "Updated" };
    mockModel.findByIdAndUpdate.mockResolvedValue(updated);

    const result = await service.update("1", { title: "Updated" });

    expect(result).toEqual(updated);
  });

  it("should throw when removing missing community", async () => {
    mockModel.deleteOne.mockResolvedValue({ deletedCount: 0 });

    await expect(service.remove("missing"))
      .rejects
      .toThrow(NotFoundException);
  });
});
