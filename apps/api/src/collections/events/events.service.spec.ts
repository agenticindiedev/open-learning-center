import { describe, it, expect, beforeEach, vi } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { EventsService } from "./events.service";
import { Event } from "./schemas/event.schema";
import { Subscription } from "../subscriptions/schemas/subscription.schema";

const createMockModel = () => ({
  find: vi.fn(),
  findById: vi.fn(),
  findByIdAndUpdate: vi.fn(),
  deleteOne: vi.fn(),
});

describe("EventsService", () => {
  let service: EventsService;
  let eventModel: ReturnType<typeof createMockModel>;
  let subscriptionModel: ReturnType<typeof createMockModel>;

  beforeEach(async () => {
    eventModel = createMockModel();
    subscriptionModel = createMockModel();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        { provide: getModelToken(Event.name), useValue: eventModel },
        { provide: getModelToken(Subscription.name), useValue: subscriptionModel },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  it("should hide meet link for paid events without subscription", async () => {
    const events = [
      {
        _id: "1",
        title: "Paid",
        isPaidOnly: true,
        meetUrl: "https://meet.google.com/test",
      },
    ];
    eventModel.find.mockReturnValue({
      sort: vi.fn().mockResolvedValue(events),
      lean: vi.fn().mockResolvedValue(events),
    });
    subscriptionModel.findOne.mockResolvedValue(null);

    const result = await service.findPublished();

    expect(result[0].meetUrl).toBe("");
  });
});
