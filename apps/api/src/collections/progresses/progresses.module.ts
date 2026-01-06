import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ProgressesController } from "./progresses.controller";
import { ProgressesService } from "./progresses.service";
import { Progress, ProgressSchema } from "./schemas/progress.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Progress.name, schema: ProgressSchema },
    ]),
  ],
  controllers: [ProgressesController],
  providers: [ProgressesService],
  exports: [ProgressesService],
})
export class ProgressesModule {}
