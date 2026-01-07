import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, type TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AchievementsService } from './achievements.service';
import { Achievement } from './schemas/achievement.schema';
import { UserAchievement } from './schemas/user-achievement.schema';

const createMockModel = () => ({
  find: vi.fn(),
  findOne: vi.fn(),
  findById: vi.fn(),
  findByIdAndUpdate: vi.fn(),
  deleteOne: vi.fn(),
});

const createMockConstructableModel = (mockModel: ReturnType<typeof createMockModel>) => {
  const MockModel = vi.fn().mockImplementation((data) => ({
    ...data,
    save: vi.fn().mockResolvedValue({ ...data, _id: 'new-id' }),
  }));
  Object.assign(MockModel, mockModel);
  return MockModel;
};

describe('AchievementsService', () => {
  let service: AchievementsService;
  let achievementModel: ReturnType<typeof createMockModel>;
  let userAchievementModel: ReturnType<typeof createMockModel>;

  beforeEach(async () => {
    achievementModel = createMockModel();
    userAchievementModel = createMockModel();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AchievementsService,
        {
          provide: getModelToken(Achievement.name),
          useValue: createMockConstructableModel(achievementModel),
        },
        {
          provide: getModelToken(UserAchievement.name),
          useValue: createMockConstructableModel(userAchievementModel),
        },
      ],
    }).compile();

    service = module.get<AchievementsService>(AchievementsService);
  });

  describe('findAll', () => {
    it('should return all achievements sorted', async () => {
      const achievements = [{ _id: '1', name: 'Achievement 1' }];
      achievementModel.find.mockReturnValue({
        sort: vi.fn().mockResolvedValue(achievements),
      });

      const result = await service.findAll();

      expect(result).toEqual(achievements);
      expect(achievementModel.find).toHaveBeenCalled();
    });
  });

  describe('findBySlug', () => {
    it('should return achievement by slug', async () => {
      const achievement = { _id: '1', name: 'Test', slug: 'test' };
      achievementModel.findOne.mockResolvedValue(achievement);

      const result = await service.findBySlug('test');

      expect(result).toEqual(achievement);
    });

    it('should throw NotFoundException when slug not found', async () => {
      achievementModel.findOne.mockResolvedValue(null);

      await expect(service.findBySlug('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return achievement by id', async () => {
      const achievement = { _id: '1', name: 'Test' };
      achievementModel.findById.mockResolvedValue(achievement);

      const result = await service.findOne('1');

      expect(result).toEqual(achievement);
    });

    it('should throw NotFoundException when id not found', async () => {
      achievementModel.findById.mockResolvedValue(null);

      await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an achievement', async () => {
      const updated = { _id: '1', name: 'Updated' };
      achievementModel.findByIdAndUpdate.mockResolvedValue(updated);

      const result = await service.update('1', { name: 'Updated' } as never);

      expect(result).toEqual(updated);
    });

    it('should throw NotFoundException when updating missing achievement', async () => {
      achievementModel.findByIdAndUpdate.mockResolvedValue(null);

      await expect(service.update('missing', {} as never)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an achievement', async () => {
      achievementModel.deleteOne.mockResolvedValue({ deletedCount: 1 });

      await expect(service.remove('1')).resolves.toBeUndefined();
    });

    it('should throw NotFoundException when removing missing achievement', async () => {
      achievementModel.deleteOne.mockResolvedValue({ deletedCount: 0 });

      await expect(service.remove('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findUserAchievements', () => {
    it('should return user achievements sorted by earnedAt', async () => {
      const userAchievements = [{ achievementId: '1', earnedAt: new Date() }];
      userAchievementModel.find.mockReturnValue({
        sort: vi.fn().mockResolvedValue(userAchievements),
      });

      const result = await service.findUserAchievements('user-1');

      expect(result).toEqual(userAchievements);
    });
  });

  describe('findRecentUserAchievements', () => {
    it('should return limited user achievements', async () => {
      const userAchievements = [{ achievementId: '1' }];
      userAchievementModel.find.mockReturnValue({
        sort: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue(userAchievements),
        }),
      });

      const result = await service.findRecentUserAchievements('user-1', 3);

      expect(result).toEqual(userAchievements);
    });
  });

  describe('awardAchievement', () => {
    it('should return null if achievement already earned', async () => {
      userAchievementModel.findOne.mockResolvedValue({ achievementId: '1' });

      const result = await service.awardAchievement('user-1', '1');

      expect(result).toBeNull();
    });
  });
});
