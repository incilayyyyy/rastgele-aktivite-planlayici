import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { Activity } from '../entities/Activity';
import Database from '../config/Database';
import { NotFoundError } from 'routing-controllers';

@Service()
export class ActivityService {
  private activityRepository: Repository<Activity>;

  constructor() {
    this.activityRepository = Database.dataSource.getRepository(Activity);
  }

  async createActivity(name: string, category: string): Promise<Activity> {
    const activity = this.activityRepository.create({ name, category });
    return this.activityRepository.save(activity);
  }

  async getActivitiesByCategory(category: string): Promise<Activity[]> {
    return this.activityRepository.find({ where: { category } });
  }

  async getRandomActivity(): Promise<Activity> {
    const activities = await this.activityRepository.find();
    if (activities.length === 0) {
      throw new NotFoundError('No activities found');
    }
    const randomIndex = Math.floor(Math.random() * activities.length);
    return activities[randomIndex];
  }

  async updateActivity(id: string, updateData: Partial<Activity>): Promise<Activity> {
    const activity = await this.activityRepository.findOne({ where: { _id: id } });
    if (!activity) {
      throw new NotFoundError('Activity not found');
    }
    Object.assign(activity, updateData);
    return this.activityRepository.save(activity);
  }

  async deleteActivity(id: string): Promise<void> {
    const activity = await this.activityRepository.findOne({ where: { _id: id } });
    if (!activity) {
      throw new NotFoundError('Activity not found');
    }
    await this.activityRepository.remove(activity);
  }
}
