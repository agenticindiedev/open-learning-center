import { describe, it, expect, beforeEach, vi } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { LessonsService } from "./lessons.service";
import { Lesson } from "./schemas/lesson.schema";
import { Course } from "../courses/schemas/course.schema";
import { Community } from "../communities/schemas/community.schema";
import { Subscription } from "../subscriptions/schemas/subscription.schema";

const createMockModel = () => ({
  findOne: vi.fn(),
  findById: vi.fn(),
  find: vi.fn(),
  findByIdAndUpdate: vi.fn(),
  deleteOne: vi.fn(),
});

describe("LessonsService", () => {
  let service: LessonsService;
  let lessonModel: ReturnType<typeof createMockModel>;
  let courseModel: ReturnType<typeof createMockModel>;
  let communityModel: ReturnType<typeof createMockModel>;
  let subscriptionModel: ReturnType<typeof createMockModel>;

  beforeEach(async () => {
    lessonModel = createMockModel();
    courseModel = createMockModel();
    communityModel = createMockModel();
    subscriptionModel = createMockModel();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessonsService,
        { provide: getModelToken(Lesson.name), useValue: lessonModel },
        { provide: getModelToken(Course.name), useValue: courseModel },
        { provide: getModelToken(Community.name), useValue: communityModel },
        { provide: getModelToken(Subscription.name), useValue: subscriptionModel },
      ],
    }).compile();

    service = module.get<LessonsService>(LessonsService);
  });

  it("should throw when lesson not found", async () => {
    lessonModel.findOne.mockResolvedValue(null);

    await expect(service.findBySlug("missing"))
      .rejects
      .toThrow(NotFoundException);
  });

  it("should return preview lesson without subscription", async () => {
    const lesson = { _id: "1", slug: "preview", courseId: "course", isPublished: true, isPreview: true };
    lessonModel.findOne.mockResolvedValue(lesson);
    courseModel.findById.mockResolvedValue({ _id: "course", communityId: "community" });
    communityModel.findById.mockResolvedValue({ _id: "community", isFree: false });
    subscriptionModel.findOne.mockResolvedValue(null);

    const result = await service.findBySlug("preview");

    expect(result).toEqual(lesson);
  });

  it("should block non-preview lesson without subscription", async () => {
    const lesson = { _id: "1", slug: "locked", courseId: "course", isPublished: true, isPreview: false };
    lessonModel.findOne.mockResolvedValue(lesson);
    courseModel.findById.mockResolvedValue({ _id: "course", communityId: "community" });
    communityModel.findById.mockResolvedValue({ _id: "community", isFree: false });
    subscriptionModel.findOne.mockResolvedValue(null);

    await expect(service.findBySlug("locked"))
      .rejects
      .toThrow(ForbiddenException);
  });
});
