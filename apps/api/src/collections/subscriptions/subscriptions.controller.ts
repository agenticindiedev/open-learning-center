import {
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser, type CurrentUserPayload } from '../../auth/decorators/current-user.decorator';
import { ClerkAuthGuard } from '../../auth/guards/clerk-auth.guard';
import { BillingService } from '../../billing/billing.service';
import { SubscriptionsService } from './subscriptions.service';

@ApiTags('subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(
    private readonly subscriptionsService: SubscriptionsService,
    private readonly billingService: BillingService,
  ) {}

  @Get('me')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get subscriptions for current user' })
  findMine(@CurrentUser() user: CurrentUserPayload) {
    return this.subscriptionsService.findByUser(user.userId);
  }

  @Post(':id/cancel')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel subscription at period end' })
  async cancel(@Param('id') id: string, @CurrentUser() user: CurrentUserPayload) {
    const subscription = await this.subscriptionsService.findById(id);

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (subscription.userId !== user.userId) {
      throw new ForbiddenException('Not authorized to cancel this subscription');
    }

    await this.billingService.cancelSubscription(subscription.stripeSubscriptionId);

    return {
      success: true,
      message: 'Subscription will be canceled at the end of the billing period',
    };
  }
}
