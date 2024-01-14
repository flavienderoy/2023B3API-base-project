import { Exclude } from 'class-transformer'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { ProjectUser } from '../../projects-users/entities/project-user.entity'
import { User } from '../../users/entities/user.entity'

@Entity()
export class Project {

  @PrimaryGeneratedColumn('uuid')
  public id: string

  @Column({ nullable: false })
  public name!: string

  @Column({ nullable: false})
  public referringEmployeeId!: string

  @ManyToOne(() => User, {
    nullable: false,
    cascade: true,
    eager: true
  })
  @JoinColumn({ name: 'referringEmployeeId' })
  public referringEmployee!: User

  @Exclude({ toPlainOnly: true })
  @OneToMany(() => ProjectUser, pu => pu.project, { nullable: false })
  members: ProjectUser[]

}