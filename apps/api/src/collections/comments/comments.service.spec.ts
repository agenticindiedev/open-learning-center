import { Test, type TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CommentsService } from './comments.service';

describe('CommentsService', () => {
  let service: CommentsService;

  const mockService = {
    create: vi.fn(),
    findByLessonId: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    countUserComments: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentsService],
    })
      .overrideProvider(CommentsService)
      .useValue(mockService)
      .compile();

    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have findByLessonId method', () => {
    expect(service.findByLessonId).toBeDefined();
  });

  it('should have findOne method', () => {
    expect(service.findOne).toBeDefined();
  });

  it('should have update method', () => {
    expect(service.update).toBeDefined();
  });

  it('should have remove method', () => {
    expect(service.remove).toBeDefined();
  });
});
