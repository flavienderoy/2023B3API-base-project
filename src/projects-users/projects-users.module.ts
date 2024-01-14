import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProjectsModule } from '../projects/projects.module'
import { UsersModule } from '../users/users.module'
import { ProjectUser } from './entities/project-user.entity'
import { ProjectUsersController } from './projects-users.controller'
import { ProjectUsersService } from './projects-users.service'

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => ProjectsModule),
    TypeOrmModule.forFeature([ProjectUser]),
  ],
  controllers: [ProjectUsersController],
  providers: [ProjectUsersService],
  exports: [ProjectUsersService],
})
export class ProjectUsersModule {}
