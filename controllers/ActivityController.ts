import {
    JsonController,
    Body,
    Post,
    Get,
    Patch,
    Delete,
    Param,
    OnUndefined,
    HttpCode,
    InternalServerError,
    NotFoundError,
    Authorized,
  } from 'routing-controllers';
  import { Service } from 'typedi';
  import { ActivityService } from '../services/ActivityService';
  import { Activity } from '../entities/Activity';
  
  @Service()
  @JsonController('/activities')
  export class ActivityController {
    constructor(private readonly activityService: ActivityService) {}
  
    @Post()
    @HttpCode(201)
    async create(@Body() body: { name: string; category: string }) {
      return this.activityService.createActivity(body.name, body.category);
    }
  
    @Get('/category/:category')
    async getByCategory(@Param('category') category: string) {
      return this.activityService.getActivitiesByCategory(category);
    }
  
    @Get('/random')
    async getRandom() {
      return this.activityService.getRandomActivity();
    }
  
    @Patch('/:id')
    async update(@Param('id') id: string, @Body() body: Partial<Activity>) {
      return this.activityService.updateActivity(id, body);
    }
  
    @Delete('/:id')
    @OnUndefined(204)
    async delete(@Param('id') id: string) {
      await this.activityService.deleteActivity(id);
    }
  }
  