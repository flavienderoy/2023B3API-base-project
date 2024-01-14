import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EventEntity } from './entities/event.entity'
import { EventsController } from './events.controller'
import { EventService } from './events.service'
import { ProjectUsersModule } from '../projects-users/projects-users.module'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([EventEntity]),
    forwardRef(() => ProjectUsersModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [
    EventsController,
  ],
  providers: [
    EventService,
  ],
  exports: [EventService],
})
export class EventsModule { }
