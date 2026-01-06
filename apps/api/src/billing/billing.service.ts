import { BadRequestException, Injectable } from "@nestjs/common";
import { Clerk } from "@clerk/clerk-sdk-node";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import Stripe from "stripe";
import { Subscription, SubscriptionDocument } from "../collections/subscriptions/schemas/subscription.schema";

@Injectable()
export class BillingService {
  private stripe: Stripe;
  private clerk: Clerk;

  constructor(
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<SubscriptionDocument>,
  ) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: "2024-12-18.acacia",
    });

    this.clerk = new Clerk({
      secretKey: process.env.CLERK_SECRET_KEY || "",
    });
  }

  getStripe() {
    return this.stripe;
  }

  async createCheckoutSession(userId: string): Promise<Stripe.Checkout.Session> {
    const priceId = process.env.STRIPE_PRICE_ID;
    if (!priceId) {
      throw new BadRequestException("STRIPE_PRICE_ID is not set");
    }

    const appUrl =
      process.env.APP_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
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
    const existing = await this.subscriptionModel
      .findOne({ userId })
      .sort({ createdAt: -1 });

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
      const user = await this.clerk.users.getUser(userId);
      const primaryEmail = user.emailAddresses.find(
        (email) => email.id === user.primaryEmailAddressId,
      )?.emailAddress;
      return primaryEmail || user.emailAddresses[0]?.emailAddress;
    } catch (error) {
      return undefined;
    }
  }
}
