import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type LessonDocument = Lesson & Document;

@Schema({ timestamps: true })
export class Lesson {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop()
  content?: string;

  @Prop()
  videoId?: string;

  @Prop({ required: true })
  courseId: string;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ default: false })
  isPreview: boolean;

  @Prop()
  createdBy?: string;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);

LessonSchema.index({ slug: 1 }, { unique: true });
LessonSchema.index({ courseId: 1, isPublished: 1, sortOrder: 1 });
