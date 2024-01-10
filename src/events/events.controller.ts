import {
  Body,
  Controller,
  Get, Param,
  ParseUUIDPipe,
  Post,
  Req,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { CreateEventDto } from './dto/create-event.dto'
import { EventService } from './events.service'
import { Event } from './entities/event.entity'


@Controller('events')
export class EventsController {
  constructor(
    private readonly eventService: EventService,
    private readonly projectUserService: EventService,
  ) { }

  @Post()
  async create(@Body() createEventDto: CreateEventDto, @Req() req): Promise<Event> {
    const userId = req.user.sub
    return this.eventService.create(createEventDto)
  }
  @Get(':id')
  async getEvent(@Param('id', ParseUUIDPipe) event: string) {
    return this.eventService.getById(event)
  }
  @Get()
  async findAll(): Promise<CreateEventDto[]> {
    return this.eventService.findAll()
  }
}