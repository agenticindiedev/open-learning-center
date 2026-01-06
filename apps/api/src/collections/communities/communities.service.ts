import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Community, CommunityDocument } from "./schemas/community.schema";
import { CreateCommunityDto } from "./dto/create-community.dto";
import { UpdateCommunityDto } from "./dto/update-community.dto";
import { toSlug } from "../../helpers/slug";

@Injectable()
export class CommunitiesService {
  constructor(
    @InjectModel(Community.name)
    private communityModel: Model<CommunityDocument>,
  ) {}

  async create(
    createCommunityDto: CreateCommunityDto,
    userId: string,
  ): Promise<Community> {
    const payload = this.normalizePayload(createCommunityDto, userId);
    const community = new this.communityModel(payload);
    return community.save();
  }

  async findPublished(): Promise<Community[]> {
    return this.communityModel
      .find({ isPublished: true })
      .sort({ sortOrder: 1, title: 1 });
  }

  async findAllAdmin(): Promise<Community[]> {
    return this.communityModel.find().sort({ sortOrder: 1, title: 1 });
  }

  async findBySlug(slug: string, includeUnpublished = false): Promise<Community> {
    const query = includeUnpublished ? { slug } : { slug, isPublished: true };
    const community = await this.communityModel.findOne(query);

    if (!community) {
      throw new NotFoundException(`Community with slug ${slug} not found`);
    }

    return community;
  }

  async findOneAdmin(id: string): Promise<Community> {
    const community = await this.communityModel.findById(id);

    if (!community) {
      throw new NotFoundException(`Community with ID ${id} not found`);
    }

    return community;
  }

  async update(
    id: string,
    updateCommunityDto: UpdateCommunityDto,
  ): Promise<Community> {
    const payload = this.normalizePayload(updateCommunityDto);
    const community = await this.communityModel.findByIdAndUpdate(
      id,
      payload,
      { new: true },
    );

    if (!community) {
      throw new NotFoundException(`Community with ID ${id} not found`);
    }

    return community;
  }

  async remove(id: string): Promise<void> {
    const result = await this.communityModel.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      throw new NotFoundException(`Community with ID ${id} not found`);
    }
  }

  private normalizePayload(
    payload: CreateCommunityDto | UpdateCommunityDto,
    userId?: string,
  ) {
    const normalized: Record<string, unknown> = {
      ...payload,
    };

    if (payload.title && !payload.slug) {
      normalized.slug = toSlug(payload.title);
    }

    if (payload.isFree === true) {
      normalized.priceMonthly = undefined;
    }

    if (userId) {
      normalized.createdBy = userId;
    }

    return normalized;
  }
}
