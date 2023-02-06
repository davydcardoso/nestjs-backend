export interface Repository<T = any> {
  create(data: T): Promise<void>;
  update(id: string, data: T): Promise<void>;
  patch(id: string, data: Partial<T>): Promise<T>;
  getById(id: string): Promise<T>;
  getAll(): Promise<T[]>;
  getOne(filter: Partial<T>): Promise<T>;
  getMany(filter: Partial<T>): Promise<T[]>;
  delete(id: string): Promise<void>;
}
