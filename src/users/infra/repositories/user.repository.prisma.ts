import { Injectable } from '@nestjs/common';

import { User } from 'src/users/domain/entity/users/user.entity';
import { Repository } from 'src/core/domain/repository';
import { UserMapper } from 'src/users/mappers/user.mapper';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserRepositoryPrisma implements Repository<User> {
  private readonly mapper: UserMapper;

  constructor(private readonly prisma: PrismaService) {
    this.mapper = new UserMapper();
  }

  async create(user: User): Promise<void> {
    const data = await this.mapper.toPersistence(user);

    await this.prisma.users.create({ data });
  }

  async update(id: string, data: User): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async patch(id: string, data: Partial<User>): Promise<User> {
    throw new Error('Method not implemented.');
  }

  async getById(id: string): Promise<User> {
    throw new Error('Method not implemented.');
  }

  async getAll(): Promise<User[]> {
    throw new Error('Method not implemented.');
  }

  async getOne(filter: Partial<User>): Promise<User> {
    throw new Error('Method not implemented.');
  }

  async getMany(filter: Partial<User>): Promise<User[]> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
