import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Date Transform Interceptor
 * Ensures all Date objects in API responses are serialized as ISO strings
 * This prevents timezone issues when dates are sent to the frontend
 */
@Injectable()
export class DateTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => this.transformDates(data))
    );
  }

  private transformDates(data: any): any {
    if (data === null || data === undefined) {
      return data;
    }

    // If it's a Date object, convert to ISO string (always UTC)
    if (data instanceof Date) {
      // Ensure we're working with UTC by using toISOString
      // This converts the Date to ISO 8601 format in UTC timezone
      // Note: toISOString() always returns UTC, regardless of Date object's timezone
      return data.toISOString();
    }

    // If it's an array, transform each item
    if (Array.isArray(data)) {
      return data.map(item => this.transformDates(item));
    }

    // If it's an object, recursively transform
    if (typeof data === 'object' && data.constructor === Object) {
      const transformed: any = {};
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const value = data[key];
          if (value instanceof Date) {
            // Convert Date to ISO string (UTC)
            transformed[key] = value.toISOString();
          } else if (value !== null && typeof value === 'object') {
            transformed[key] = this.transformDates(value);
          } else {
            transformed[key] = value;
          }
        }
      }
      return transformed;
    }

    return data;
  }
}

