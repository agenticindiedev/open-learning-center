import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type CommunityDocument = Community & Document;

@Schema({ timestamps: true })
export class Community {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop()
  description?: string;

  @Prop({ default: false })
  isFree: boolean;

  @Prop()
  priceMonthly?: number;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop()
  coverImageUrl?: string;

  @Prop()
  createdBy?: string;
}

export const CommunitySchema = SchemaFactory.createForClass(Community);

CommunitySchema.index({ slug: 1 }, { unique: true });
CommunitySchema.index({ isPublished: 1, sortOrder: 1 });
