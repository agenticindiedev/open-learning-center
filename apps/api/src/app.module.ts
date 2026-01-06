import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { CommunitiesModule } from "./collections/communities/communities.module";
import { CoursesModule } from "./collections/courses/courses.module";
import { LessonsModule } from "./collections/lessons/lessons.module";
import { MembershipsModule } from "./collections/memberships/memberships.module";
import { SubscriptionsModule } from "./collections/subscriptions/subscriptions.module";
import { ProgressesModule } from "./collections/progresses/progresses.module";
import { EventsModule } from "./collections/events/events.module";
import { BillingModule } from "./billing/billing.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || "mongodb://localhost/api"),
    CommunitiesModule,
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
