import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Subscription, SubscriptionDocument } from "./schemas/subscription.schema";
import { CreateSubscriptionDto } from "./dto/create-subscription.dto";

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<SubscriptionDocument>,
  ) {}

  async upsertFromStripe(payload: CreateSubscriptionDto): Promise<Subscription> {
    return this.subscriptionModel.findOneAndUpdate(
      { stripeSubscriptionId: payload.stripeSubscriptionId },
      {
        ...payload,
        status: payload.status || "active",
      },
      { new: true, upsert: true },
    );
  }

  async findActiveByUser(userId: string): Promise<Subscription | null> {
    return this.subscriptionModel.findOne({ userId, status: "active" });
  }

  async findByUser(userId: string): Promise<Subscription[]> {
    return this.subscriptionModel.find({ userId }).sort({ createdAt: -1 });
  }
}
