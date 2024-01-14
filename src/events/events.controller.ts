import {
  Body,
  Controller,
  Get, HttpCode, Param,
  ParseUUIDPipe,
  Post,
  Req,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { CreateEventDto } from './dto/create-event.dto'
import { EventService } from './events.service'
import { EventEntity, EventStatus } from './entities/event.entity'
import { User } from '../users/entities/user.entity'


@Controller('events')
export class EventsController {
  constructor(
    private readonly eventService: EventService,
    private readonly projectUserService: EventService,
  ) { }

  @Post()
  public async post(@Body() createEventDto: CreateEventDto, @Req() req: Request): Promise<EventEntity> {
    const user = req['user'] as User
    return this.eventService.create(createEventDto, user)
  }

  @Get(':id')
  async getEvent(@Param('id', ParseUUIDPipe) event: string) {
    return this.eventService.getById(event)
  }
  @Get()
  async findAll(): Promise<CreateEventDto[]> {
    return this.eventService.findAll()
  }

  @HttpCode(201)
  @Get('/:id/validate')
  public async validate(@Param('id', ParseUUIDPipe) uuid: string, @Req() req: Request): Promise<EventEntity> {
    const user = req['user'] as User
    return this.eventService.tryUpdateStatus(user, uuid, EventStatus.Accepted)
  }

  @HttpCode(201)
  @Get('/:id/decline')
  public async decline(@Param('id', ParseUUIDPipe) uuid: string, @Req() req: Request): Promise<EventEntity> {
    const user = req['user'] as User
    return this.eventService.tryUpdateStatus(user, uuid, EventStatus.Declined)
  }
}