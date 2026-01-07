import { createClerkClient } from "@clerk/backend";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import type { Model } from "mongoose";
import Stripe from "stripe";
import {
  Subscription,
  type SubscriptionDocument,
} from "../collections/subscriptions/schemas/subscription.schema";
import { ConfigService } from "../config/config.service";

@Injectable()
export class BillingService {
  private stripe: Stripe;

  constructor(
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<SubscriptionDocument>,
    private readonly configService: ConfigService,
  ) {
    const secretKey = this.configService.get("STRIPE_SECRET_KEY");
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: "2025-12-15.clover",
    });
  }

  getStripe() {
    return this.stripe;
  }
  async createCheckoutSession(userId: string): Promise<Stripe.Checkout.Session> {
    const priceId = this.configService.getOptional("STRIPE_PRICE_ID");
    if (!priceId) {
      throw new BadRequestException("STRIPE_PRICE_ID is not set");
    }

    const appUrl =
      this.configService.getOptional("APP_URL") ||
      this.configService.getOptional("NEXT_PUBLIC_APP_URL") ||
      "http://localhost:3000";

    const customerId = await this.getOrCreateCustomer(userId);

    return this.stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/billing/success`,
      cancel_url: `${appUrl}/billing/cancel`,
      client_reference_id: userId,
      metadata: { userId },
      subscription_data: {
        metadata: { userId },
      },
      allow_promotion_codes: true,
    });
  }

  private async getOrCreateCustomer(userId: string): Promise<string> {
    const existing = await this.subscriptionModel.findOne({ userId }).sort({ createdAt: -1 });

    if (existing?.stripeCustomerId) {
      return existing.stripeCustomerId;
    }

    const email = await this.getUserEmail(userId);
    const customer = await this.stripe.customers.create({
      email,
      metadata: { userId },
    });

    return customer.id;
  }

  private async getUserEmail(userId: string): Promise<string | undefined> {
    try {
      const clerkSecretKey = this.configService.get("CLERK_SECRET_KEY");
      const clerk = createClerkClient({ secretKey: clerkSecretKey });
      const user = await clerk.users.getUser(userId);
      const primaryEmail = user.emailAddresses.find(
        (email: { id: string; emailAddress: string }) => email.id === user.primaryEmailAddressId,
      )?.emailAddress;
      return primaryEmail || user.emailAddresses[0]?.emailAddress;
    } catch {
      return undefined;
    }
  }
}
