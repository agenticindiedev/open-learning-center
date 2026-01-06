import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { SubscriptionsService } from "./subscriptions.service";
import { ClerkAuthGuard } from "../../auth/guards/clerk-auth.guard";
import { CurrentUser, CurrentUserPayload } from "../../auth/decorators/current-user.decorator";

@ApiTags("subscriptions")
@Controller("subscriptions")
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get("me")
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get subscriptions for current user" })
  findMine(@CurrentUser() user: CurrentUserPayload) {
    return this.subscriptionsService.findByUser(user.userId);
  }
}
