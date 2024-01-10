import { Body, Controller, ForbiddenException, Get, NotFoundException, Param, ParseUUIDPipe, Post, Req, UnauthorizedException, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common'
import { Request as ExpressRequest } from 'express'
import { TransformInterceptor } from '../interceptor/transform.interceptor'
import { User, UserRole } from '../users/entities/user.entity'
import { CreateProjectDto } from './dto/create-project.dto'
import { Project } from './entities/project.entity'
import { ProjectsService } from './projects.service'
import { ProjectUsersService } from '../projects-users/projects-users.service'

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService,
    private readonly projectsUsersService: ProjectUsersService) { }

  @Post()
  async postProject(@Body() createProjectDto: CreateProjectDto, @Req() req: ExpressRequest): Promise<Project> {
    const user = req['user'] as User
    if (user.role !== UserRole.Admin)
      throw new UnauthorizedException()
    return this.projectsService.create(createProjectDto)
  }

  @Get()
  findAll(): Promise<Project[]> {
    return this.projectsService.getAll()
  }

  @Get()
  public async getProjects(user: User): Promise<Project[]> {
    return this.projectsService.getUsersProjects(user)
  }

  @Get(':id')
  async getProjectById(@Param("id", ParseUUIDPipe) id: string, @Req() req: ExpressRequest): Promise<Project | null> {
    const user = req['user'] as User
    const project = await this.projectsService.getProjectById(id)
    if (!project) throw new NotFoundException()

    if (user.role === UserRole.Employee) {
      const projectUser = await this.projectsUsersService.getProjectsByUserProject(user, project)
      if (!projectUser) throw new ForbiddenException()
    }

    return project
  }
}
