import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateCommentDto {
  @ApiProperty({ description: "The lesson ID this comment belongs to" })
  @IsString()
  @IsNotEmpty()
  lessonId: string;

  @ApiProperty({ description: "The comment content" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content: string;

  @ApiPropertyOptional({ description: "Parent comment ID for replies" })
  @IsString()
  @IsOptional()
  parentId?: string;
}
