import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data) => {
        if (
          data !== null &&
          typeof data === 'object' &&
          !Array.isArray(data) &&
          typeof (data as { success?: unknown }).success === 'boolean'
        ) {
          return data;
        }
        return {
          success: true,
          data,
          meta: { timestamp: new Date().toISOString() },
        };
      }),
    );
  }
}
