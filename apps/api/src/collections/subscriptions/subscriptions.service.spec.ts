import { describe, it, expect, beforeEach, vi } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { SubscriptionsService } from "./subscriptions.service";
import { Subscription } from "./schemas/subscription.schema";

const createMockModel = () => ({
  findOneAndUpdate: vi.fn(),
  findOne: vi.fn(),
  find: vi.fn(),
});

describe("SubscriptionsService", () => {
  let service: SubscriptionsService;
  let subscriptionModel: ReturnType<typeof createMockModel>;

  beforeEach(async () => {
    subscriptionModel = createMockModel();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionsService,
        { provide: getModelToken(Subscription.name), useValue: subscriptionModel },
      ],
    }).compile();

    service = module.get<SubscriptionsService>(SubscriptionsService);
  });

  it("should upsert subscription", async () => {
    const result = { _id: "sub" };
    subscriptionModel.findOneAndUpdate.mockResolvedValue(result);

    const response = await service.upsertFromStripe({
      userId: "user",
      stripeCustomerId: "cus",
      stripeSubscriptionId: "sub",
      status: "active",
    });

    expect(response).toEqual(result);
  });

  it("should find active subscription", async () => {
    const result = { _id: "sub" };
    subscriptionModel.findOne.mockResolvedValue(result);

    const response = await service.findActiveByUser("user");

    expect(response).toEqual(result);
  });
});
