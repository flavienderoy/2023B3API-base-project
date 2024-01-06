import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, HttpCode, UseInterceptors, Req, ParseUUIDPipe, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto'
import { TransformInterceptor } from '../interceptor/transform.interceptor'
import { Request as ExpressRequest } from 'express'
import { User } from './entities/user.entity'
import { PublicAccess } from '../public-access.decorator'

@UseInterceptors(TransformInterceptor)
@UsePipes(ValidationPipe)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @PublicAccess()
  @Post('auth/sign-up')
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @PublicAccess()
  @HttpCode(201)
  @Post('auth/login')
  async login(@Body() dto: LoginUserDto) : Promise<{ access_token: string }> {
    // Appel du service pour gérer l'authentification
    // Retourne le token JWT dans un objet avec la clé 'access_token'
    return { access_token: await this.usersService.login(dto) }
  }

  @HttpCode(200)
  @Get('/me')
  async me(@Req() req: ExpressRequest) : Promise<User> {
      return req['user'] as User
  }

  @Get() 
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async getUserById(@Param("id", ParseUUIDPipe) id: string) {
    const user = await this.usersService.getUserById(id)
    if (user) return user
    throw new NotFoundException()
  }
  

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
