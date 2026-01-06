import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { json } from "express";
import type { Response } from "express";
import { BillingController } from "./billing.controller";
import { BillingService } from "./billing.service";
import { StripeWebhookController } from "./stripe-webhook.controller";
import { Subscription, SubscriptionSchema } from "../collections/subscriptions/schemas/subscription.schema";
import { SubscriptionsService } from "../collections/subscriptions/subscriptions.service";
import type { IRawBodyRequest } from "../types/requests";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
    ]),
  ],
  controllers: [BillingController, StripeWebhookController],
  providers: [BillingService, SubscriptionsService],
})
export class BillingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        json({
          verify: (req: IRawBodyRequest, _res: Response, buf: Buffer) => {
            req.rawBody = buf;
          },
        }),
      )
      .forRoutes("webhooks/stripe");
  }
}
