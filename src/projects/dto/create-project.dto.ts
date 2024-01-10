import { IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator'

export class CreateProjectDto {

  @IsString()
  @MinLength(3) 
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID('4')
  referringEmployeeId!: string;
}