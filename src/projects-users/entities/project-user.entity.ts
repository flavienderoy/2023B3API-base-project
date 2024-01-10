import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Project } from '../../projects/entities/project.entity'
import { User } from '../../users/entities/user.entity'
import { Exclude } from 'class-transformer'

@Entity({ name: 'project-user' })
export class ProjectUser {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string

  @Column({ nullable: false })
  startDate!: Date

  @Column({ nullable: false })
  endDate!: Date

  @Column({ nullable: false })
  projectId!: string

  @Exclude({ toPlainOnly: true })
  @ManyToOne(() => Project, { nullable: false, cascade: true })
  @JoinColumn({ name: 'projectId' })
  project!: Project

  @Column({ nullable: false })
  userId!: string

  @Exclude({ toPlainOnly: true })
  @ManyToOne(() => User, { nullable: false, cascade: true })
  @JoinColumn({ name: 'userId' })
  user!: User
}