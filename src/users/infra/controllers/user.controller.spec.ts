import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyAdapter } from '@nestjs/platform-fastify/adapters';
import { PrismaClient } from '@prisma/client';
import { AppModule } from 'src/app.module';
import { hash } from 'bcrypt';

describe('Create User API test', () => {
  let app: NestFastifyApplication;
  let prisma: PrismaClient;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      imports: [AppModule],
      providers: [],
    }).compile();

    prisma = new PrismaClient();

    app = module.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it('Valida se o componente APP foi definido', async () => {
    expect(app).toBeDefined();
  });

  it('CREATE USER: Teste de rota', async () => {
    return app
      .inject({
        method: 'POST',
        url: '/users',
        payload: {
          name: 'Usuario de Teste',
          email: 'usuario@mail.com',
          password: 'Dv@_8246',
        },
      })
      .then(async (result) => {
        expect(result.statusCode).toBe(201);

        const prisma = new PrismaClient();

        await prisma.users.delete({ where: { email: 'usuario@mail.com' } });
      });
  });

  describe('/POST CREATE: Teste para criacão de usuario', () => {
    it('/POST: Valida criacão de conta em caso de sucesso', async () => {
      return app
        .inject({
          method: 'POST',
          path: '/users',
          payload: {
            name: 'Usuario de Teste',
            email: 'usuario@mail.com',
            password: 'Dv@_8246',
          },
        })
        .then(async (result) => {
          expect(result.statusCode).toBe(201);

          const user = await prisma.users.findUnique({
            where: { email: 'usuario@mail.com' },
          });

          expect(user).toBeTruthy();

          await prisma.users.delete({ where: { email: 'usuario@mail.com' } });
        });
    });

    it('/POST: Valida tratamento de erro em caso de conta existente', async () => {
      await prisma.users.create({
        data: {
          name: 'Usuario de Teste',
          email: 'usuario@mail.com',
          password: await hash('Dv@_8246', 8),
        },
      });

      return app
        .inject({
          method: 'POST',
          path: '/users',
          payload: {
            name: 'Usuario de Teste',
            email: 'usuario@mail.com',
            password: 'Dv@_8246',
          },
        })
        .then(async (result) => {
          expect(result.statusCode).toBe(400);
        });
    });

    describe('/POST: Valida tratamento de erro em caso de dados incorretos', () => {
      it('/POST: Valida caso de "name" incorreto', async () => {
        return app
          .inject({
            method: 'POST',
            path: '/users',
            payload: {
              name: 'DC',
              email: 'usuario@mail.com',
              password: 'Dv@_8246',
            },
          })
          .then(async (result) => {
            expect(result.statusCode).toBe(400);
          });
      });

      it('/POST: valida caso de email incorreto', async () => {
        return app
          .inject({
            method: 'POST',
            path: '/users',
            payload: {
              name: 'Usuario de Teste',
              email: 'usuario@mail',
              password: 'Dv@_8246',
            },
          })
          .then(async (result) => {
            expect(result.statusCode).toBe(400);
          });
      });

      it('/POST: valida caso de senha incorreta', async () => {
        return app
          .inject({
            method: 'POST',
            path: '/users',
            payload: {
              name: 'Usuario de Teste',
              email: 'usuario@mail.com',
              password: '123456',
            },
          })
          .then(async (result) => {
            expect(result.statusCode).toBe(400);
          });
      });
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });
});
