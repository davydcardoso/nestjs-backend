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

  async update(id: string, user: User): Promise<void> {
    const data = await this.mapper.toPersistence(user);

    await this.prisma.users.update({ data, where: { id } });
  }

  async patch(id: string, data: Partial<User>): Promise<User> {
    throw new Error('Method not implemented.');
  }

  async getById(id: string): Promise<User> {
    const user = await this.prisma.users.findUnique({ where: { id } });

    if (!user) {
      return null;
    }

    return this.mapper.toDomain(user);
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.prisma.users.findUnique({ where: { email } });

    if (!user) {
      return null;
    }

    return this.mapper.toDomain(user);
  }

  async getAll(): Promise<User[]> {
    const users = await this.prisma.users.findMany();

    if (!users || users.length <= 0) {
      return null;
    }

    return users.map((user) => this.mapper.toDomain(user));
  }

  async getOne(filter: Partial<User>): Promise<User> {
    throw new Error('Method not implemented.');
  }

  async getMany(filter: Partial<User>): Promise<User[]> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<void> {
    const user = await this.prisma.users.findUnique({ where: { id } });

    if (!user) {
      throw new Error('Não existe usuário com esté ID');
    }

    await this.prisma.users.delete({ where: { id } });
  }
}
