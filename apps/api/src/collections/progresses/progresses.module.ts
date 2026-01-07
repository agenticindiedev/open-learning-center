import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AchievementsModule } from '../achievements/achievements.module';
import { LessonsModule } from '../lessons/lessons.module';
import { ProgressesController } from './progresses.controller';
import { ProgressesService } from './progresses.service';
import { Progress, ProgressSchema } from './schemas/progress.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Progress.name, schema: ProgressSchema }]),
    forwardRef(() => AchievementsModule),
    forwardRef(() => LessonsModule),
  ],
  controllers: [ProgressesController],
  providers: [ProgressesService],
  exports: [ProgressesService],
})
export class ProgressesModule {}
