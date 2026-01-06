import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MembershipsController } from "./memberships.controller";
import { MembershipsService } from "./memberships.service";
import { Membership, MembershipSchema } from "./schemas/membership.schema";
import { Community, CommunitySchema } from "../communities/schemas/community.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Membership.name, schema: MembershipSchema },
      { name: Community.name, schema: CommunitySchema },
    ]),
  ],
  controllers: [MembershipsController],
  providers: [MembershipsService],
  exports: [MembershipsService],
})
export class MembershipsModule {}
