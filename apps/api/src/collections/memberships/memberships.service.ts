import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Membership, MembershipDocument } from "./schemas/membership.schema";
import { CreateMembershipDto } from "./dto/create-membership.dto";
import { Community, CommunityDocument } from "../communities/schemas/community.schema";

@Injectable()
export class MembershipsService {
  constructor(
    @InjectModel(Membership.name)
    private membershipModel: Model<MembershipDocument>,
    @InjectModel(Community.name)
    private communityModel: Model<CommunityDocument>,
  ) {}

  async create(
    createMembershipDto: CreateMembershipDto,
    userId: string,
  ): Promise<Membership> {
    const community = await this.communityModel.findById(
      createMembershipDto.communityId,
    );

    if (!community) {
      throw new NotFoundException("Community not found");
    }

    if (!community.isFree) {
      throw new ForbiddenException("Paid communities require subscription");
    }

    const membership = await this.membershipModel.findOneAndUpdate(
      { userId, communityId: createMembershipDto.communityId },
      {
        userId,
        communityId: createMembershipDto.communityId,
        status: "active",
        source: createMembershipDto.source || "free",
      },
      { new: true, upsert: true },
    );

    return membership;
  }

  async findMine(userId: string): Promise<Membership[]> {
    return this.membershipModel
      .find({ userId, status: "active" })
      .sort({ createdAt: -1 });
  }
}
