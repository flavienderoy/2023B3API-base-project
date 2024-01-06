import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { UsersService } from '../users.service'
import { UserRole } from '../entities/user.entity'
import { PublicAccess } from '../../public-access.decorator'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly users: UsersService,
    private readonly reflector: Reflector
  ) { }

  // Return false => 403 Forbidden
  // Return true  => Continue...
  // Throw UnauthorizeException => 401 Unauthorized
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const publicAccess = this.reflector.getAllAndOverride<boolean>(
      PublicAccess,
      [context.getClass(), context.getHandler()]
    )

    // Decorating a route handler or a controller class using @PublicAccess will
    // disable authentication process for decorated members
    if (publicAccess) return true
    const req = context.switchToHttp().getRequest<Request>()

    if (req.headers.authorization) {
      const token = extractJwtFromHeader(req.headers.authorization)

      if (token) {
        const payload = await this.users.verifyToken(token)

        if (payload && payload.id) {
          const user = await this.users.getUserById(payload.id)

          if (user) {
            // Token and user are valid, injecting user to request object
            req['user'] = user
            return true
          }
        }
      }
    }

    // Invalid token or permission level too low, Http 401 Unauthorized
    throw new UnauthorizedException()
  }
}

/**
 * Helper for extracting JWT from request authorization header.
 */
function extractJwtFromHeader(authorizationHeader: string): string | null {
  const [type, token] = authorizationHeader.split(' ')

  return type?.toLowerCase() === 'bearer' ? token : null
}