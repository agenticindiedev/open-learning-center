import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CommunitiesModule } from "./collections/communities/communities.module";
import { CommentsModule } from "./collections/comments/comments.module";
import { CoursesModule } from "./collections/courses/courses.module";
import { LessonsModule } from "./collections/lessons/lessons.module";
import { MembershipsModule } from "./collections/memberships/memberships.module";
import { SubscriptionsModule } from "./collections/subscriptions/subscriptions.module";
import { ProgressesModule } from "./collections/progresses/progresses.module";
import { EventsModule } from "./collections/events/events.module";
import { BillingModule } from "./billing/billing.module";
import { ConfigModule } from "./config/config.module";
import { ConfigService } from "./config/config.service";

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
