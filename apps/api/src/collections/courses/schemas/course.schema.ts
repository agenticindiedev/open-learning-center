import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type CourseDocument = Course & Document;

@Schema({ timestamps: true })
export class Course {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  communityId: string;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop()
  coverImageUrl?: string;

  @Prop()
  createdBy?: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);

CourseSchema.index({ slug: 1 }, { unique: true });
CourseSchema.index({ communityId: 1, isPublished: 1, sortOrder: 1 });
