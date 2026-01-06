import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  startsAt: Date;

  @Prop()
  endsAt?: Date;

  @Prop({ required: true })
  meetUrl: string;

  @Prop()
  communityId?: string;

  @Prop({ default: false })
  isPaidOnly: boolean;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop()
  createdBy?: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);

EventSchema.index({ startsAt: 1 });
EventSchema.index({ communityId: 1, startsAt: 1 });
