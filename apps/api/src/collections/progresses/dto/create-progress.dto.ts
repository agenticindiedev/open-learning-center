import { Type } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";

export class CreateProgressDto {
  @IsString()
  lessonId: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  completedAt?: Date;
}
