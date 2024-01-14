import { Body, Controller, ForbiddenException, Get, NotFoundException, Param, ParseUUIDPipe, Post, Req, UnauthorizedException } from '@nestjs/common'
import { Request as ExpressRequest } from 'express'
import { ProjectUsersService } from '../projects-users/projects-users.service'
import { User, UserRole } from '../users/entities/user.entity'
import { CreateProjectDto } from './dto/create-project.dto'
import { Project } from './entities/project.entity'
import { ProjectsService } from './projects.service'

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService,
    private readonly projectsUsersService: ProjectUsersService) { }

  @Post()
  async postProject(@Body() createProjectDto: CreateProjectDto, @Req() req: ExpressRequest): Promise<Project> {
    const user = req['user'] as User
    if (user.role !== UserRole.Admin)
      throw new UnauthorizedException("You don't have the rights to do this.")
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
    if (!project) throw new NotFoundException("The project doesn't exist.")

    if (user.role === UserRole.Employee) {
      const projectUser = await this.projectsUsersService.getProjectsByUserProject(user, project)
      if (!projectUser) throw new ForbiddenException("You don't have the rights to do this.")
    }

    return project
  }
}
