import { describe, it, expect, beforeEach, vi } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { ProgressesService } from "./progresses.service";
import { Progress } from "./schemas/progress.schema";

const createMockModel = () => ({
  findOneAndUpdate: vi.fn(),
  find: vi.fn(),
});

describe("ProgressesService", () => {
  let service: ProgressesService;
  let progressModel: ReturnType<typeof createMockModel>;

  beforeEach(async () => {
    progressModel = createMockModel();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProgressesService,
        { provide: getModelToken(Progress.name), useValue: progressModel },
      ],
    }).compile();

    service = module.get<ProgressesService>(ProgressesService);
  });

  it("should upsert progress", async () => {
    const result = { _id: "progress" };
    progressModel.findOneAndUpdate.mockResolvedValue(result);

    const response = await service.upsert({ lessonId: "lesson" }, "user");

    expect(response).toEqual(result);
  });
});
