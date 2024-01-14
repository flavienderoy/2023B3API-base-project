import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Project } from './entities/project.entity'
import { CreateProjectDto } from './dto/create-project.dto'
import { UsersService } from '../users/users.service'
import { User, UserRole } from '../users/entities/user.entity'


@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    private usersService: UsersService
  ) { }

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const user = await this.usersService.getUserById(createProjectDto.referringEmployeeId)
    if (!user) throw new NotFoundException("The user doesn't exist.")
    if(user && user.role === UserRole.Employee)
      throw new UnauthorizedException("You don't have the rights to do this.")
    const newProject = this.projectsRepository.create(createProjectDto)
    return {
      ...await this.projectsRepository.save(newProject), 
      referringEmployee: user
    }
  }

  async getProjectById(id: string): Promise<Project | null> {
    return this.projectsRepository.findOneBy({ id })
  }

  async getAll(): Promise<Project[]> {
    return this.projectsRepository.find()
  }

  async findAll(): Promise<Project[]> {
    return this.projectsRepository.find({ relations: ['referringEmployee', 'members'] })
  }

  public async findProjectsDependingOnUser(user: User): Promise<Project[]> {
    const projects = await this.findAll()

    if (user.role === UserRole.Employee) {
       return projects.filter(p => p.members.find(pu => pu.userId === user.id))
    }

    return projects
  }

  async getUsersProjects(user: User): Promise<Project[]> {
    return this.projectsRepository.findBy({ referringEmployeeId: user.id })
  }
}