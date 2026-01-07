import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, type TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Subscription } from '../subscriptions/schemas/subscription.schema';
import { EventsService } from './events.service';
import { Event } from './schemas/event.schema';

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

describe('EventsService', () => {
  let service: EventsService;
  let eventModel: ReturnType<typeof createMockModel>;
  let subscriptionModel: ReturnType<typeof createMockModel>;

  beforeEach(async () => {
    eventModel = createMockModel();
    subscriptionModel = createMockModel();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        { provide: getModelToken(Event.name), useValue: createMockConstructableModel(eventModel) },
        { provide: getModelToken(Subscription.name), useValue: subscriptionModel },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  describe('findPublished', () => {
    it('should hide meet link for paid events without subscription', async () => {
      const events = [
        { _id: '1', title: 'Paid', isPaidOnly: true, meetUrl: 'https://meet.google.com/test' },
      ];
      eventModel.find.mockReturnValue({
        sort: vi.fn().mockReturnValue({
          lean: vi.fn().mockResolvedValue(events),
        }),
      });
      subscriptionModel.findOne.mockResolvedValue(null);

      const result = await service.findPublished();

      expect(result[0].meetUrl).toBe('');
    });

    it('should show meet link for paid events with active subscription', async () => {
      const events = [
        { _id: '1', title: 'Paid', isPaidOnly: true, meetUrl: 'https://meet.google.com/test' },
      ];
      eventModel.find.mockReturnValue({
        sort: vi.fn().mockReturnValue({
          lean: vi.fn().mockResolvedValue(events),
        }),
      });
      subscriptionModel.findOne.mockResolvedValue({ status: 'active' });

      const result = await service.findPublished('user-1');

      expect(result[0].meetUrl).toBe('https://meet.google.com/test');
    });

    it('should return empty array when no events', async () => {
      eventModel.find.mockReturnValue({
        sort: vi.fn().mockReturnValue({
          lean: vi.fn().mockResolvedValue([]),
        }),
      });

      const result = await service.findPublished();

      expect(result).toEqual([]);
    });

    it('should show meet link for free events without subscription', async () => {
      const events = [
        { _id: '1', title: 'Free', isPaidOnly: false, meetUrl: 'https://meet.google.com/free' },
      ];
      eventModel.find.mockReturnValue({
        sort: vi.fn().mockReturnValue({
          lean: vi.fn().mockResolvedValue(events),
        }),
      });

      const result = await service.findPublished();

      expect(result[0].meetUrl).toBe('https://meet.google.com/free');
    });
  });

  describe('findAllAdmin', () => {
    it('should return all events for admin', async () => {
      const events = [{ _id: '1', title: 'Event 1' }];
      eventModel.find.mockReturnValue({
        sort: vi.fn().mockResolvedValue(events),
      });

      const result = await service.findAllAdmin();

      expect(result).toEqual(events);
    });
  });

  describe('findOneAdmin', () => {
    it('should return event by id', async () => {
      const event = { _id: '1', title: 'Test' };
      eventModel.findById.mockResolvedValue(event);

      const result = await service.findOneAdmin('1');

      expect(result).toEqual(event);
    });

    it('should throw NotFoundException when event not found', async () => {
      eventModel.findById.mockResolvedValue(null);

      await expect(service.findOneAdmin('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an event', async () => {
      const updated = { _id: '1', title: 'Updated' };
      eventModel.findByIdAndUpdate.mockResolvedValue(updated);

      const result = await service.update('1', { title: 'Updated' } as never);

      expect(result).toEqual(updated);
    });

    it('should throw NotFoundException when updating missing event', async () => {
      eventModel.findByIdAndUpdate.mockResolvedValue(null);

      await expect(service.update('missing', {} as never)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an event', async () => {
      eventModel.deleteOne.mockResolvedValue({ deletedCount: 1 });

      await expect(service.remove('1')).resolves.toBeUndefined();
    });

    it('should throw NotFoundException when removing missing event', async () => {
      eventModel.deleteOne.mockResolvedValue({ deletedCount: 0 });

      await expect(service.remove('missing')).rejects.toThrow(NotFoundException);
    });
  });
});
