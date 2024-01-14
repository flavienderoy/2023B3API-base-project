import { Module, ValidationPipe } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EventEntity } from './events/entities/event.entity'
import { EventsModule } from './events/events.module'
import { TransformInterceptor } from './interceptor/transform.interceptor'
import { ProjectUser } from './projects-users/entities/project-user.entity'
import { ProjectUsersModule } from './projects-users/projects-users.module'
import { Project } from './projects/entities/project.entity'
import { ProjectsModule } from './projects/projects.module'
import { AuthGuard } from './users/auth/auth.guard'
import { User } from './users/entities/user.entity'
import { UsersModule } from './users/users.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, Project, ProjectUser, EventEntity], // Add "EventEntity" to the entities array (no "Event" for Shadowing Problem with NESTJS)
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    ProjectsModule,
    ProjectUsersModule,
    EventsModule,
  ],
  controllers: [],
  providers: [{
    provide: APP_GUARD,
    useClass: AuthGuard
  }, {
    provide: APP_INTERCEPTOR,
    useClass: TransformInterceptor
  },
  {
    provide: APP_PIPE,
    useValue: new ValidationPipe({ transform: true })
  }],
})
export class AppModule { }

