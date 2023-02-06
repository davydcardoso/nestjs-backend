import { Either } from '../logic/Either';

export interface UseCase {
  perform(...args: any[]): Promise<Either<Error, object>>;
}
