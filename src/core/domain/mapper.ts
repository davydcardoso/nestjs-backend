export abstract class Mapper<E, P> {
  abstract toDomain(raw: P): E;
  abstract toPersistence(raw: E): Promise<P>;
}
