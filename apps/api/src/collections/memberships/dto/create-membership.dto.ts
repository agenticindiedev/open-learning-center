import { IsOptional, IsString } from "class-validator";

export class CreateMembershipDto {
  @IsString()
  communityId: string;

  @IsOptional()
  @IsString()
  source?: string;
}
