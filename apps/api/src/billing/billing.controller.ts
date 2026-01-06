import { Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ClerkAuthGuard } from "../auth/guards/clerk-auth.guard";
import { CurrentUser, CurrentUserPayload } from "../auth/decorators/current-user.decorator";
import { BillingService } from "./billing.service";
import type { IBillingCheckoutResponse } from "../types/billing";

@ApiTags("billing")
@Controller("billing")
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post("checkout")
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create Stripe checkout session" })
  async createCheckoutSession(
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<IBillingCheckoutResponse> {
    const session = await this.billingService.createCheckoutSession(user.userId);
    return { url: session.url || "" };
  }
}
