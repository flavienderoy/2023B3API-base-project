import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'
import { UserRole } from '../entities/user.entity'

export class CreateUserDto {

  @IsString()
  @MinLength(3) 
  @IsNotEmpty()
  username!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
