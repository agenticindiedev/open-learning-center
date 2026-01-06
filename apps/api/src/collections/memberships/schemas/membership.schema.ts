import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type MembershipDocument = Membership & Document;

@Schema({ timestamps: true })
export class Membership {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  communityId: string;

  @Prop({ default: "active" })
  status: string;

  @Prop({ default: "free" })
  source: string;

  @Prop({ default: () => new Date() })
  joinedAt: Date;

  @Prop()
  canceledAt?: Date;
}

export const MembershipSchema = SchemaFactory.createForClass(Membership);

MembershipSchema.index({ userId: 1, communityId: 1 }, { unique: true });
MembershipSchema.index({ userId: 1, status: 1 });
