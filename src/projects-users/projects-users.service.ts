import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  Repository
} from 'typeorm'
import { Project } from '../projects/entities/project.entity'
import { ProjectsService } from '../projects/projects.service'
import { User } from '../users/entities/user.entity'
import { UsersService } from '../users/users.service'
import { CreateProjectUserDto } from './dto/create.project-user'
import { ProjectUser } from './entities/project-user.entity'
import * as dayjs from 'dayjs'
import * as isBetween from 'dayjs/plugin/isBetween'

@Injectable()
export class ProjectUsersService {
  constructor(
    @InjectRepository(ProjectUser)
    private projectsUserRepository: Repository<ProjectUser>,
    private usersService: UsersService,
    private projectsService: ProjectsService
  ) { }

  async create(dto: CreateProjectUserDto): Promise<ProjectUser> {
    const user = await this.usersService.getUserById(dto.userId)
    if (!user) throw new NotFoundException()
    
    const project = await this.projectsService.getProjectById(dto.projectId)
    if (!project) throw new NotFoundException()


    const dates = await this.projectsUserRepository.findBy({ userId: user.id })
    for (const date of dates) {
      const overlap = Math.max(
        Math.min(dto.endDate.getTime(), date.endDate.getTime()) -
        Math.max(dto.startDate.getTime(), date.startDate.getTime()),
        0
      )

      if (overlap > 0) throw new ConflictException("This user isn't free for the given period.")
    }
    return this.projectsUserRepository.save(this.projectsUserRepository.create(dto))
  }

  async getById(id: string): Promise<ProjectUser> {
    return this.projectsUserRepository.findOneBy({ id })
  }

  async getAll(): Promise<ProjectUser[]> {
    return this.projectsUserRepository.find()
  }

  async getProjectsByUserProject(user: User, project: Project | null): Promise<ProjectUser | null> {
    return this.projectsUserRepository.findOneBy({ userId: user.id, projectId: project.id })
  }

  public async findByUser(user: User): Promise<ProjectUser[]> {
    return this.projectsUserRepository.find({
      where: { userId: user.id },
      relations: ['project', 'user']
    })
  }

  public async findByUserAndDay(user: User, day: Date): Promise<ProjectUser[]> {
    return (await this.findByUser(user)).filter(m => dayjs(day).isBetween(m.startDate, m.endDate, 'day', '[]'))
  }
}