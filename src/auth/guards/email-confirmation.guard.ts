import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import RequestWithUser from 'types/request-with-user.interface';

@Injectable()
export class EmailConfirmationGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request: RequestWithUser = context.switchToHttp().getRequest();

    if (!request.user?.isConfirmed) {
      throw new UnauthorizedException('Please confirm your email address');
    }

    return true;
  }
}
