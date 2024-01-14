import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { EventStatus, EventType } from '../entities/event.entity'
import { Type } from 'class-transformer'

export class CreateEventDto {

  @Type(() => Date)
  @IsDate()
  public date!: Date

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @IsEnum(EventStatus)
  public eventStatus?: EventStatus

  @IsString()
  @IsNotEmpty()
  @IsEnum(EventType)
  public eventType!: EventType

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public eventDescription?: string

}