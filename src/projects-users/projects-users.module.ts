import { forwardRef, Module } from '@nestjs/common';
import { ProjectUsersService } from './projects-users.service';
import { ProjectUsersController } from './projects-users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectUser } from './entities/project-user.entity';
import { UsersModule } from '../users/users.module';
import { ProjectsModule } from '../projects/projects.module';

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
