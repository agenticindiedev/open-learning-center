import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Progress, ProgressDocument } from "./schemas/progress.schema";
import { CreateProgressDto } from "./dto/create-progress.dto";

@Injectable()
export class ProgressesService {
  constructor(
    @InjectModel(Progress.name) private progressModel: Model<ProgressDocument>,
  ) {}

  async upsert(
    createProgressDto: CreateProgressDto,
    userId: string,
  ): Promise<Progress> {
    const completedAt = createProgressDto.completedAt || new Date();

    return this.progressModel.findOneAndUpdate(
      { userId, lessonId: createProgressDto.lessonId },
      { userId, lessonId: createProgressDto.lessonId, completedAt },
      { new: true, upsert: true },
    );
  }

  async findMine(userId: string): Promise<Progress[]> {
    return this.progressModel.find({ userId }).sort({ updatedAt: -1 });
  }
}
