import { Controller, Headers, Post, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import Stripe from "stripe";
import { BillingService } from "./billing.service";
import { SubscriptionsService } from "../collections/subscriptions/subscriptions.service";
import type { IRawBodyRequest } from "../types/requests";

@ApiTags("webhooks")
@Controller("webhooks/stripe")
export class StripeWebhookController {
  constructor(
    private readonly billingService: BillingService,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  @Post()
  async handleWebhook(
    @Req() request: IRawBodyRequest,
    @Headers("stripe-signature") signature?: string,
  ) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return { received: true };
    }

    if (!signature || !request.rawBody) {
      return { received: true };
    }

    let event: Stripe.Event;

    try {
      event = this.billingService
        .getStripe()
        .webhooks.constructEvent(request.rawBody, signature, webhookSecret);
    } catch (error) {
      return { received: true };
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "subscription" && session.subscription) {
          await this.handleSubscription(session.subscription.toString(), session);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await this.upsertSubscription(subscription);
        break;
      }
      default:
        break;
    }

    return { received: true };
  }

  private async handleSubscription(
    subscriptionId: string,
    session: Stripe.Checkout.Session,
  ) {
    const subscription = await this.billingService
      .getStripe()
      .subscriptions.retrieve(subscriptionId);

    const userId =
      session.client_reference_id || subscription.metadata.userId || "";

    if (!userId) {
      return;
    }

    await this.subscriptionsService.upsertFromStripe({
      userId,
      stripeCustomerId: subscription.customer.toString(),
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      currentPeriodEnd: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000)
        : undefined,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    });
  }

  private async upsertSubscription(subscription: Stripe.Subscription) {
    const userId = subscription.metadata.userId || "";

    if (!userId) {
      return;
    }

    await this.subscriptionsService.upsertFromStripe({
      userId,
      stripeCustomerId: subscription.customer.toString(),
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      currentPeriodEnd: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000)
        : undefined,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    });
  }
}
