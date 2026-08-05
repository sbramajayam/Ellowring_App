import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const key = req.headers['x-api-key'] as string | undefined;
    const expected = process.env.ENTERPRISE_API_KEY || 'ellowring-dev-enterprise-key';
    if (!key || key !== expected) {
      throw new UnauthorizedException('Invalid or missing X-API-Key');
    }
    return true;
  }
}
