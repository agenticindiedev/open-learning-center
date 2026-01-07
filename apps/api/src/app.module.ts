import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BillingModule } from './billing/billing.module';
import { AchievementsModule } from './collections/achievements/achievements.module';
import { CommentsModule } from './collections/comments/comments.module';
import { CommunitiesModule } from './collections/communities/communities.module';
import { CoursesModule } from './collections/courses/courses.module';
import { EventsModule } from './collections/events/events.module';
import { LessonsModule } from './collections/lessons/lessons.module';
import { MembershipsModule } from './collections/memberships/memberships.module';
import { ProgressesModule } from './collections/progresses/progresses.module';
import { SubscriptionsModule } from './collections/subscriptions/subscriptions.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.mongoURL,
      }),
      inject: [ConfigService],
    }),
    AchievementsModule,
    CommunitiesModule,
    CommentsModule,
    CoursesModule,
    LessonsModule,
    MembershipsModule,
    SubscriptionsModule,
    ProgressesModule,
    EventsModule,
    BillingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
