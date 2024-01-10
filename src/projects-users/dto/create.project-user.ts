import { IsDate, IsDateString, IsNotEmpty, IsString, IsUUID } from 'class-validator'


export class CreateProjectUserDto {

  @IsString()
  @IsNotEmpty()
  @IsDateString()
  startDate!: Date

  @IsString()
  @IsNotEmpty()
  @IsDateString()
  endDate!: Date

  @IsString()
  @IsNotEmpty()
  @IsUUID('4')
  projectId!: string

  @IsString()
  @IsNotEmpty()
  @IsUUID('4')
  userId!: string
}