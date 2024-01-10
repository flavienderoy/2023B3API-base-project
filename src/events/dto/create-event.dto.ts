import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'
import { PrimaryGeneratedColumn } from 'typeorm'
import { EventStatus, EventType } from '../entities/event.entity'

export class CreateEventDto {
  @IsString()
  @IsUUID('4')
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @IsString()
  @IsNotEmpty()
  @IsDateString()
  public date!: Date

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @IsEnum(['Pending', 'Accepted', 'Declined'])
  public eventStatus?: EventStatus

  @IsString()
  @IsNotEmpty()
  @IsEnum(['RemoteWork', 'PaidLeave'])
  public eventType!: EventType

  @IsString()
  @IsOptional()
  public eventDescription?: string

  @IsString()
  @IsNotEmpty()
  @IsUUID('4')
  public userId!: string //au format uuidv4
}