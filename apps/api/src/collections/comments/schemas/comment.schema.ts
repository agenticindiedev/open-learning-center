import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ required: true })
  lessonId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  userName: string;

  @Prop()
  userAvatar?: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  parentId?: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.index({ lessonId: 1, createdAt: -1 });
CommentSchema.index({ parentId: 1 });
