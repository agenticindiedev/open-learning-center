import { getModelToken } from '@nestjs/mongoose';
import { Test, type TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AchievementsService } from '../achievements/achievements.service';
import { LessonsService } from '../lessons/lessons.service';
import { ProgressesService } from './progresses.service';
import { Progress } from './schemas/progress.schema';

const createMockModel = () => {
  // Create a thenable object that also has sort() for chaining
  const createFindResult = () => {
    const result: unknown[] = [];
    return Object.assign(Promise.resolve(result), {
      sort: vi.fn().mockResolvedValue(result),
    });
  };
  return {
    findOneAndUpdate: vi.fn(),
    find: vi.fn().mockImplementation(() => createFindResult()),
    countDocuments: vi.fn(),
  };
};

const createMockAchievementsService = () => ({
  checkAndAwardAchievements: vi.fn().mockResolvedValue([]),
});

const createMockLessonsService = () => ({
  findOneAdmin: vi.fn().mockResolvedValue({ slug: 'test-lesson' }),
});

describe('ProgressesService', () => {
  let service: ProgressesService;
  let progressModel: ReturnType<typeof createMockModel>;
  let achievementsService: ReturnType<typeof createMockAchievementsService>;
  let lessonsService: ReturnType<typeof createMockLessonsService>;

  beforeEach(async () => {
    progressModel = createMockModel();
    achievementsService = createMockAchievementsService();
    lessonsService = createMockLessonsService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProgressesService,
        { provide: getModelToken(Progress.name), useValue: progressModel },
        { provide: AchievementsService, useValue: achievementsService },
        { provide: LessonsService, useValue: lessonsService },
      ],
    }).compile();

    service = module.get<ProgressesService>(ProgressesService);
  });

  it('should upsert progress', async () => {
    const progressResult = { _id: 'progress', lessonId: 'lesson', userId: 'user' };
    progressModel.findOneAndUpdate.mockResolvedValue(progressResult);
    progressModel.countDocuments.mockResolvedValue(1);

    const response = await service.upsert({ lessonId: 'lesson' }, 'user');

    expect(response.progress).toEqual(progressResult);
    expect(response.newAchievements).toEqual([]);
  });
});
