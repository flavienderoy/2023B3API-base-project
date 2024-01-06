import { Exclude } from 'class-transformer'
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

export enum UserRole {
  Employee = 'Employee',
  Admin = 'Admin',
  ProjectManager = 'ProjectManager'
}

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ unique: true })
    username: string

    @Column({ unique: true })
    email: string

    @Column()
    @Exclude({toPlainOnly: true})
    password: string

    @Column({ default: UserRole.Employee })
    role: UserRole
}