import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as dayjs from 'dayjs'
import { Repository } from 'typeorm'
import { EventStatus, EventType } from './entities/event.entity'
import { User, UserRole } from '../users/entities/user.entity'
import { CreateEventDto } from './dto/create-event.dto'
import { EventEntity } from './entities/event.entity'
import { ProjectUsersService } from '../projects-users/projects-users.service'


@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventEntity)
    private eventRepository: Repository<EventEntity>,
    private projectUsers: ProjectUsersService,
  ) { }

  public async findByUser(user: User, type?: EventType): Promise<EventEntity[]> {
    return this.eventRepository.findBy({ userId: user.id, eventType: type })
  }

  public async create(createEventDto: CreateEventDto, user: User): Promise<EventEntity> {
    const eventsOfUser = await this.findByUser(user)

    const remoteWorkCount = eventsOfUser.filter(e => dayjs(e.date).isSame(createEventDto.date, 'week') && e.eventType === EventType.RemoteWork).length
    const eventCountPerDay = eventsOfUser.filter(e => dayjs(e.date).isSame(createEventDto.date, 'days')).length

    if (remoteWorkCount >= 2) {
      throw new UnauthorizedException("You can't have more than 2 days of remote work per week.")
    }
    if (eventCountPerDay > 0) {
      throw new UnauthorizedException("You can't have more than 1 event per day.")
    }

    const eventStatus = createEventDto.eventType === EventType.RemoteWork ? EventStatus.Accepted : EventStatus.Pending

    return this.eventRepository.save(this.eventRepository.create({
      ...createEventDto,
      userId: user.id,
      eventStatus,
    }))
  }

  async getById(id: string): Promise<EventEntity> {
    return this.eventRepository.findOneBy({ id })
  }

  async findAll(): Promise<EventEntity[]> {
    return this.eventRepository.find()
  }

  public async tryUpdateStatus(user: User, uuid: string, status: EventStatus): Promise<EventEntity> {
    const event = await this.getById(uuid)
    if (!event) throw new NotFoundException('There is no event matching to the given uuid.')

    if (user.role === UserRole.ProjectManager) {
      const members = await this.projectUsers.findByUserAndDay(event.user, event.date)

      for (const member of members) {
        if (member.project.referringEmployeeId !== user.id)
          throw new UnauthorizedException("Your aren't the referring employee for the event period.")
      }
    }

    event.eventStatus = status

    return this.eventRepository.save(event)
  }
}