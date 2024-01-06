import { IsNotEmpty, IsEmail, Length, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../entities/user.entity';

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
