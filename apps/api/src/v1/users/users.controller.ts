import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersServiceV1 } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from './users.decorator';
import { StatEntity, UserEntity } from '@shared/entities';
import UsersSearch from '../dto/usersSearch.dto';
import UserCreate from '../dto/userCreate.dto';
import { RecaptchaGuard } from '@shared/guards/recaptcha.guard';
import UserGraphsGet from '../dto/userGraphs.dto';
import UserGraphsResponse from '@shared/interfaces/responses/userGraphs.interface';
import UserStatsGet from '../dto/userStats.dto';

@Controller({
  path: 'users',
  version: '1',
})
export class UsersControllerV1 {
  constructor(private usersService: UsersServiceV1) {}

  @Post()
  @UseGuards(RecaptchaGuard)
  async createUser(@Body() userCreateDto: UserCreate): Promise<UserEntity> {
    return await this.usersService.creteUser(userCreateDto);
  }

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  me(@User() user: UserEntity): UserEntity {
    return user;
  }

  @Get('search')
  @UseGuards(AuthGuard('jwt'))
  async searchUsers(
    @Query() usersSearchDto: UsersSearch,
  ): Promise<UserEntity[]> {
    return await this.usersService.searchUsers(usersSearchDto);
  }

  @Get('/:user')
  async getUser(@Param('user') user: string): Promise<UserEntity> {
    return await this.usersService.findUser(user);
  }

  @Get('/:user/stats')
  async getUserStats(
    @Param('user') user: string,
    @Query() { mode }: UserStatsGet,
  ): Promise<StatEntity> {
    return await this.usersService.getUserStats(user, mode);
  }

  @Get('/:user/graphs')
  async getUserGraphs(
    @Param('user') user: string,
    @Query() { mode }: UserGraphsGet,
  ): Promise<UserGraphsResponse> {
    return await this.usersService.getUsersGraphs(user, mode);
  }
}
