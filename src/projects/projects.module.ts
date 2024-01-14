import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProjectUsersModule } from '../projects-users/projects-users.module'
import { UsersModule } from '../users/users.module'
import { Project } from './entities/project.entity'
import { ProjectsController } from './projects.controller'
import { ProjectsService } from './projects.service'

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => ProjectUsersModule),
    TypeOrmModule.forFeature([Project])
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService]
})

export class ProjectsModule { }