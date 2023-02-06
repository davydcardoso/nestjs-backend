import { Injectable } from '@nestjs/common';
import { Users as UserPersistence } from '@prisma/client';
import { Mapper } from 'src/core/domain/mapper';
import { Email } from '../domain/entity/users/email';
import { Name } from '../domain/entity/users/name';
import { Password } from '../domain/entity/users/password';
import { User } from '../domain/entity/users/user.entity';

export class UserMapper extends Mapper<User, UserPersistence> {
  toDomain(raw: UserPersistence): User {
    const nameOrError = Name.create(raw.name);
    const emailOrError = Email.create(raw.email);
    const passwordOrError = Password.create(raw.password, true);

    if (nameOrError.isLeft()) {
      throw new Error('Name value is invalid.');
    }

    if (emailOrError.isLeft()) {
      throw new Error('Email value is invalid.');
    }

    if (passwordOrError.isLeft()) {
      throw new Error('Password value is invalid.');
    }

    const userOrError = User.create(
      {
        name: nameOrError.value,
        email: emailOrError.value,
        password: passwordOrError.value,
      },
      raw.id,
    );

    if (userOrError.isRight()) {
      return userOrError.value;
    }

    return null;
  }

  async toPersistence(raw: User): Promise<UserPersistence> {
    return {
      id: raw.id,
      name: raw.name.value,
      email: raw.email.value,
      password: await raw.password.getHashedValue(),
    };
  }
}
