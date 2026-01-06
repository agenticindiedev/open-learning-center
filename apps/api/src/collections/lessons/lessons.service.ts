import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Lesson, LessonDocument } from "./schemas/lesson.schema";
import { Course, CourseDocument } from "../courses/schemas/course.schema";
import { Community, CommunityDocument } from "../communities/schemas/community.schema";
import { Subscription, SubscriptionDocument } from "../subscriptions/schemas/subscription.schema";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";
import { toSlug } from "../../helpers/slug";

@Injectable()
export class LessonsService {
  constructor(
    @InjectModel(Lesson.name) private lessonModel: Model<LessonDocument>,
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    @InjectModel(Community.name) private communityModel: Model<CommunityDocument>,
    @InjectModel(Subscription.name) private subscriptionModel: Model<SubscriptionDocument>,
  ) {}

  async create(createLessonDto: CreateLessonDto, userId: string): Promise<Lesson> {
    const payload = this.normalizePayload(createLessonDto, userId);
    const lesson = new this.lessonModel(payload);
    return lesson.save();
  }

  async findPublished(courseId: string, userId?: string): Promise<Lesson[]> {
    const course = await this.courseModel.findById(courseId);
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    const community = await this.communityModel.findById(course.communityId);
    const hasAccess = await this.hasAccess(userId, community);

    const filter: Record<string, unknown> = {
      courseId,
      isPublished: true,
    };

    if (!hasAccess) {
      filter.isPreview = true;
    }

    return this.lessonModel.find(filter).sort({ sortOrder: 1, title: 1 });
  }

  async findBySlug(slug: string, userId?: string): Promise<Lesson> {
    const lesson = await this.lessonModel.findOne({ slug, isPublished: true });

    if (!lesson) {
      throw new NotFoundException(`Lesson with slug ${slug} not found`);
    }

    const course = await this.courseModel.findById(lesson.courseId);
    if (!course) {
      throw new NotFoundException(`Course with ID ${lesson.courseId} not found`);
    }

    const community = await this.communityModel.findById(course.communityId);
    const hasAccess = await this.hasAccess(userId, community);

    if (!hasAccess && !lesson.isPreview) {
      throw new ForbiddenException("Subscription required to access this lesson");
    }

    return lesson;
  }

  async findAllAdmin(courseId?: string): Promise<Lesson[]> {
    const filter: Record<string, unknown> = {};
    if (courseId) {
      filter.courseId = courseId;
    }
    return this.lessonModel.find(filter).sort({ sortOrder: 1, title: 1 });
  }

  async findOneAdmin(id: string): Promise<Lesson> {
    const lesson = await this.lessonModel.findById(id);

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }

    return lesson;
  }

  async update(id: string, updateLessonDto: UpdateLessonDto): Promise<Lesson> {
    const payload = this.normalizePayload(updateLessonDto);
    const lesson = await this.lessonModel.findByIdAndUpdate(id, payload, {
      new: true,
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }

    return lesson;
  }

  async remove(id: string): Promise<void> {
    const result = await this.lessonModel.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }
  }

  private async hasAccess(userId?: string, community?: CommunityDocument | null) {
    if (!community) {
      return false;
    }

    if (community.isFree) {
      return true;
    }

    if (!userId) {
      return false;
    }

    const subscription = await this.subscriptionModel.findOne({
      userId,
      status: "active",
    });

    return Boolean(subscription);
  }

  private normalizePayload(
    payload: CreateLessonDto | UpdateLessonDto,
    userId?: string,
  ) {
    const normalized: Record<string, unknown> = {
      ...payload,
    };

    if (payload.title && !payload.slug) {
      normalized.slug = toSlug(payload.title);
    }

    if (userId) {
      normalized.createdBy = userId;
    }

    return normalized;
  }
}
