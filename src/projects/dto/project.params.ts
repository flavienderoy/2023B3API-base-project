import { IsUUID } from 'class-validator'

export class ProjectParams {
  @IsUUID('4')
  id: string
}