import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser, type CurrentUserPayload } from '../../auth/decorators/current-user.decorator';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { ClerkAuthGuard } from '../../auth/guards/clerk-auth.guard';
import { AchievementsService } from './achievements.service';
import type { CreateAchievementDto } from './dto/create-achievement.dto';
import type { UpdateAchievementDto } from './dto/update-achievement.dto';

@ApiTags('achievements')
@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all achievement definitions' })
  findAll() {
    return this.achievementsService.findAll();
  }

  @Get('my')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all achievements with user status' })
  findAllWithStatus(@CurrentUser() user: CurrentUserPayload) {
    return this.achievementsService.findAllWithUserStatus(user.userId);
  }

  @Get('my/recent')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user recent achievements' })
  findRecentUserAchievements(
    @CurrentUser() user: CurrentUserPayload,
    @Query('limit') limit?: string,
  ) {
    const parsedLimit = limit ? Number.parseInt(limit, 10) : 5;
    return this.achievementsService.findRecentUserAchievements(user.userId, parsedLimit);
  }

  @Get('my/earned')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user earned achievements' })
  findUserAchievements(@CurrentUser() user: CurrentUserPayload) {
    return this.achievementsService.findUserAchievements(user.userId);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get achievement by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.achievementsService.findBySlug(slug);
  }

  @Post()
  @UseGuards(ClerkAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: create an achievement' })
  create(@Body() createAchievementDto: CreateAchievementDto) {
    return this.achievementsService.create(createAchievementDto);
  }

  @Patch(':id')
  @UseGuards(ClerkAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: update an achievement' })
  update(@Param('id') id: string, @Body() updateAchievementDto: UpdateAchievementDto) {
    return this.achievementsService.update(id, updateAchievementDto);
  }

  @Delete(':id')
  @UseGuards(ClerkAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: delete an achievement' })
  remove(@Param('id') id: string) {
    return this.achievementsService.remove(id);
  }
}
