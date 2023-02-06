import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersController } from './infra/controllers/users.controller';
import { UserRepository } from './infra/repositories/user.repository';
import { UserRepositoryPrisma } from './infra/repositories/user.repository.prisma';
import { CreateUserUseCase } from './use-cases/create-user-usecase';

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: UserRepository,
      useClass: UserRepositoryPrisma,
    },
    CreateUserUseCase,
  ],
  imports: [PrismaModule],
})
export class UsersModule {}
