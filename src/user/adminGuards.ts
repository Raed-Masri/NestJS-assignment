import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // Assuming user object has a `role` property and admin role is "admin"
        if (user && user.role === 'admin') {
            return true;
        } else {
            throw new UnauthorizedException('You do not have permission to access this resource.');
        }
    }
}
