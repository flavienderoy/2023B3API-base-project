import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

export type EventStatus = 'Pending' | 'Accepted' | 'Declined'
export type EventType = 'RemoteWork' | 'PaidLeave'

@Entity()
export class Event {

  @PrimaryGeneratedColumn('uuid')
  public readonly id!: string //au format uuidv4

  @Column()
  public date!: Date

  @Column({ default: 'Pending', enum: ['Pending', 'Accepted', 'Declined'] })
  public eventStatus?: EventStatus

  @Column({enum: ['RemoteWork', 'PaidLeave']})
  public eventType!: EventType

  @Column()
  public eventDescription?: string

  @Column()
  public userId!: string //au format uuidv4

}