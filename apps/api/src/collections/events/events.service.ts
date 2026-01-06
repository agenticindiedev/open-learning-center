import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Event, EventDocument } from "./schemas/event.schema";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { Subscription, SubscriptionDocument } from "../subscriptions/schemas/subscription.schema";

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<SubscriptionDocument>,
  ) {}

  async create(createEventDto: CreateEventDto, userId: string): Promise<Event> {
    const event = new this.eventModel({
      ...createEventDto,
      createdBy: userId,
    });
    return event.save();
  }

  async findPublished(userId?: string): Promise<Event[]> {
    const events = await this.eventModel
      .find({ isPublished: true })
      .sort({ startsAt: 1 })
      .lean();

    if (!events.length) {
      return [];
    }

    const hasAccess = userId
      ? Boolean(
          await this.subscriptionModel.findOne({ userId, status: "active" }),
        )
      : false;

    return events.map((event) => {
      if (event.isPaidOnly && !hasAccess) {
        return { ...event, meetUrl: "" } as Event;
      }
      return event as Event;
    });
  }

  async findAllAdmin(): Promise<Event[]> {
    return this.eventModel.find().sort({ startsAt: 1 });
  }

  async findOneAdmin(id: string): Promise<Event> {
    const event = await this.eventModel.findById(id);

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.eventModel.findByIdAndUpdate(id, updateEventDto, {
      new: true,
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return event;
  }

  async remove(id: string): Promise<void> {
    const result = await this.eventModel.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
  }
}
