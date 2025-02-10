import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// this interceptor removes fields from the response before sending it to the client
@Injectable()
export class RemoveFieldInterceptor implements NestInterceptor {
  private readonly FIELDS_TO_REMOVE = ['password', 'passwordHash', 'deletedAt'];

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.removeFields(data)));
  }

  private removeFields(data: any): any {
    if (Array.isArray(data)) {
      return data.map((item) => this.removeFields(item));
    }

    if (data && typeof data === 'object') {
      for (const key of Object.keys(data)) {
        if (this.FIELDS_TO_REMOVE.includes(key)) {
          delete data[key];
        } else if (typeof data[key] === 'object') {
          data[key] = this.removeFields(data[key]);
        }
      }
    }

    return data;
  }
}
