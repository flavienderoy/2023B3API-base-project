import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto'
import passport from 'passport'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async create(createUserDto: CreateUserDto) : Promise<User> {
    const saltOrRounds = 10;
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: await argon2.hash(createUserDto.password),
    })
    return this.usersRepository.save(newUser)
  }

  async login(dto: LoginUserDto) : Promise<string> {
    const user = await this.usersRepository.findOneBy({ email: dto.email })

    if (!user || !(await argon2.verify(user.password, dto.password))) {
      throw new UnauthorizedException()
    }

    // Vous pouvez retourner l'utilisateur ou générer un jeton JWT, selon vos besoins
    return this.jwtService.signAsync({ id: user.id})
  }

  public async verifyToken(token: string): Promise<{ id : string} | null> {
    return this.jwtService.verifyAsync(token)
  }

  async getUserById(id: string) : Promise<User> {
    return this.usersRepository.findOneBy({id})
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
}
