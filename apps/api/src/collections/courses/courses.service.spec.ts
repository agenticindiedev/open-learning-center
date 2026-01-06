import { describe, it, expect, beforeEach, vi } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { NotFoundException } from "@nestjs/common";
import { CoursesService } from "./courses.service";
import { Course } from "./schemas/course.schema";

const createMockModel = () => ({
  find: vi.fn(),
  findOne: vi.fn(),
  findById: vi.fn(),
  findByIdAndUpdate: vi.fn(),
  deleteOne: vi.fn(),
});

describe("CoursesService", () => {
  let service: CoursesService;
  let mockModel: ReturnType<typeof createMockModel>;

  beforeEach(async () => {
    mockModel = createMockModel();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: getModelToken(Course.name),
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

    service = module.get<CoursesService>(CoursesService);
  });

  it("should list published courses", async () => {
    const course = { _id: "1", title: "Course", slug: "course" };
    mockModel.find.mockReturnValue({
      sort: vi.fn().mockResolvedValue([course]),
    });

    const result = await service.findPublished();

    expect(result).toEqual([course]);
    expect(mockModel.find).toHaveBeenCalledWith({ isPublished: true });
  });

  it("should throw when course slug not found", async () => {
    mockModel.findOne.mockResolvedValue(null);

    await expect(service.findBySlug("missing"))
      .rejects
      .toThrow(NotFoundException);
  });

  it("should throw when removing missing course", async () => {
    mockModel.deleteOne.mockResolvedValue({ deletedCount: 0 });

    await expect(service.remove("missing"))
      .rejects
      .toThrow(NotFoundException);
  });
});
