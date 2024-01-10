import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateEventDto } from './dto/create-event.dto'
import { Event } from './entities/event.entity'


@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) { }

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const newEvent = this.eventRepository.create(
      createEventDto
    )
    return this.eventRepository.save(newEvent)
  }

  async getById(id: string): Promise<Event> {
    return this.eventRepository.findOneBy({ id })
  }

  async findAll(): Promise<Event[]> {
    return this.eventRepository.find()
  }
}