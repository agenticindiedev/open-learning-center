import { Type } from "class-transformer";
import {
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateEventDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Date)
  @IsDate()
  startsAt: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endsAt?: Date;

  @IsString()
  meetUrl: string;

  @IsOptional()
  @IsString()
  communityId?: string;

  @IsOptional()
  @IsBoolean()
  isPaidOnly?: boolean;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
