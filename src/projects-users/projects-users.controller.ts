import { Body, Controller, Get, NotFoundException, Param, ParseUUIDPipe, Post, Req, UnauthorizedException, UseInterceptors } from '@nestjs/common'
import { Request as ExpressRequest } from 'express'
import { TransformInterceptor } from '../interceptor/transform.interceptor'
import { User, UserRole } from '../users/entities/user.entity'
import { CreateProjectUserDto } from './dto/create.project-user'
import { ProjectUser } from './entities/project-user.entity'
import { ProjectUsersService } from './projects-users.service'

@UseInterceptors(TransformInterceptor)
@Controller('/project-users')
export class ProjectUsersController {
  constructor(private readonly projectUsersService: ProjectUsersService) { }

  @Post()
  async postProjectUsers(@Body() createProjectUserDto: CreateProjectUserDto, @Req() req: ExpressRequest): Promise<ProjectUser> {
    const user = req['user'] as User
    if (user.role === UserRole.Employee)
      throw new UnauthorizedException("You don't have the rights to do this.")
    return this.projectUsersService.create(createProjectUserDto)
  }

  @Get()
  async findAll(): Promise<ProjectUser[]> {
    return this.projectUsersService.getAll()
  }

  @Get('/:id')
  async getProjectUserById(@Param("id", ParseUUIDPipe) id: string): Promise<ProjectUser> {
    const projectMember = await this.projectUsersService.getById(id)
    if (projectMember) return projectMember
     throw new NotFoundException("The project member doesn't exist.")
  }
}