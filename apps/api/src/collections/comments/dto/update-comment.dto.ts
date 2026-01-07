import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateCommentDto {
  @ApiPropertyOptional({ description: "The comment content" })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  content?: string;
}
