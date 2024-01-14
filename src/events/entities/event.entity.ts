import { Exclude } from 'class-transformer'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '../../users/entities/user.entity'

export enum EventStatus {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Declined = 'Declined'
}

export enum EventType {
  RemoteWork = 'RemoteWork',
  PaidLeave = 'PaidLeave'
}

@Entity()
export class EventEntity { // and not Event because Event is a reserved word in JS (shadowing problem)

  @PrimaryGeneratedColumn('uuid')
  public readonly id!: string //au format uuidv4

  @Column()
  public date!: Date

  @Column({ default: EventStatus.Pending, enum: EventStatus, nullable: false})
  public eventStatus?: EventStatus

  @Column({ enum: EventType, nullable: false })
  public eventType!: EventType

  @Column({default: null, nullable: true})
  public eventDescription?: string

  @Column({ nullable: false })
  public userId!: string //au format uuidv4

  @Exclude({ toPlainOnly: true })
  @ManyToOne(() => User, { nullable: false, cascade: true, eager: true })
  @JoinColumn({ name: 'userId' })
  user!: User

}