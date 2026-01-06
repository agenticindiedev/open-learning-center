import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Course, CourseDocument } from "./schemas/course.schema";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { toSlug } from "../../helpers/slug";

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
  ) {}

  async create(createCourseDto: CreateCourseDto, userId: string): Promise<Course> {
    const payload = this.normalizePayload(createCourseDto, userId);
    const course = new this.courseModel(payload);
    return course.save();
  }

  async findPublished(communityId?: string): Promise<Course[]> {
    const filter: Record<string, unknown> = { isPublished: true };
    if (communityId) {
      filter.communityId = communityId;
    }

    return this.courseModel.find(filter).sort({ sortOrder: 1, title: 1 });
  }

  async findAllAdmin(communityId?: string): Promise<Course[]> {
    const filter: Record<string, unknown> = {};
    if (communityId) {
      filter.communityId = communityId;
    }

    return this.courseModel.find(filter).sort({ sortOrder: 1, title: 1 });
  }

  async findBySlug(slug: string, includeUnpublished = false): Promise<Course> {
    const filter = includeUnpublished ? { slug } : { slug, isPublished: true };
    const course = await this.courseModel.findOne(filter);

    if (!course) {
      throw new NotFoundException(`Course with slug ${slug} not found`);
    }

    return course;
  }

  async findOneAdmin(id: string): Promise<Course> {
    const course = await this.courseModel.findById(id);

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const payload = this.normalizePayload(updateCourseDto);
    const course = await this.courseModel.findByIdAndUpdate(id, payload, {
      new: true,
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  async remove(id: string): Promise<void> {
    const result = await this.courseModel.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
  }

  private normalizePayload(
    payload: CreateCourseDto | UpdateCourseDto,
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
