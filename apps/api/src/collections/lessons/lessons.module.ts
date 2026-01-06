import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { LessonsController } from "./lessons.controller";
import { LessonsService } from "./lessons.service";
import { Lesson, LessonSchema } from "./schemas/lesson.schema";
import { Course, CourseSchema } from "../courses/schemas/course.schema";
import { Community, CommunitySchema } from "../communities/schemas/community.schema";
import { Subscription, SubscriptionSchema } from "../subscriptions/schemas/subscription.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lesson.name, schema: LessonSchema },
      { name: Course.name, schema: CourseSchema },
      { name: Community.name, schema: CommunitySchema },
      { name: Subscription.name, schema: SubscriptionSchema },
    ]),
  ],
  controllers: [LessonsController],
  providers: [LessonsService],
  exports: [LessonsService],
})
export class LessonsModule {}
