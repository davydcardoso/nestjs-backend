import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase } from './create-user-usecase';
import { InvalidNameUserError } from '../domain/entity/errors/invalid-name-user.error';
import { InvalidUserEmailError } from '../domain/entity/errors/invalid-user-email.error';
import { InvalidPasswordUserError } from '../domain/entity/errors/invalid-password-user.error';
import { UserRepositoryPrisma } from '../infra/repositories/user.repository.prisma';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserRepository } from '../infra/repositories/user.repository';
import { PrismaClient } from '@prisma/client';

describe('CreateUserUseCase', () => {
  let usecase: CreateUserUseCase;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateUserUseCase],
      imports: [PrismaModule],
      providers: [
        {
          provide: UserRepository,
          useClass: UserRepositoryPrisma,
        },
      ],
    }).compile();

    usecase = module.get<CreateUserUseCase>(CreateUserUseCase);
  });

  it('Classe construida com sucesso', () => {
    expect(usecase).toBeDefined();
  });

  describe('CREATE USER: Teste de validação de Dados', () => {
    it('Validação de nome de usuário', async () => {
      const result = await usecase.perform({
        name: '',
        email: 'teste@gmail.com',
        password: 'dv8246',
      });

      expect(result.value as Error).toEqual(new InvalidNameUserError());
    });

    describe('CREATE USER: Validação de E-MAIL', () => {
      it('CREATE USER: Validação de email incorreto', async () => {
        const result = await usecase.perform({
          name: 'Usuario Teste',
          email: 'test@mail',
          password: 'dv8246',
        });

        expect(result.value).toEqual(new InvalidUserEmailError('test@mail'));
      });

      it('CREATE USER: Validação de email com dominio', async () => {
        const result = await usecase.perform({
          name: 'Usuario Teste',
          email: 'usuario@test.com',
          password: 'dv8246',
        });

        expect(result.value as Error).not.toEqual(
          new InvalidUserEmailError('usuario@test.com'),
        );
      });
    });

    it('CREATE USER: Validação de senha do usuário', async () => {
      const result = await usecase.perform({
        name: 'Usuario Teste',
        email: 'test@mail.com',
        password: '123',
      });

      expect(result.value as Error).toEqual(new InvalidPasswordUserError());

      const result2 = await usecase.perform({
        name: 'Usuario teste',
        email: 'teste@mail.com',
        password: '12345',
      });
      expect(result2.value as Error).toEqual(new InvalidPasswordUserError());
    });

    describe('CREATE USER: Validação de registro em banco de dados', () => {
      it('CREATE USER: Criacão de usuário', async () => {
        const result = await usecase.perform({
          name: 'Usuario Teste',
          email: 'usuario@test.com',
          password: 'Dv@_8246',
        });

        expect(result.value as Error).not.toEqual(new Error());

        const prisma = new PrismaClient();

        const user = await prisma.users.findUnique({
          where: { email: 'usuario@test.com' },
        });

        expect(user).toBeTruthy()
      });
    });
  });
});
