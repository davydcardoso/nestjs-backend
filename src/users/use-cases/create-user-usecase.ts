import { Injectable } from '@nestjs/common/decorators';
import { UseCase } from 'src/core/domain/use-case';

import { Either, left, right } from 'src/core/logic/either';

import { InvalidNameUserError } from '../domain/entity/errors/invalid-name-user.error';
import { InvalidUserEmailError } from '../domain/entity/errors/invalid-user-email.error';
import { InvalidPasswordUserError } from '../domain/entity/errors/invalid-password-user.error';

import { User } from '../domain/entity/users/user.entity';
import { Name } from '../domain/entity/users/name';
import { Email } from '../domain/entity/users/email';
import { Password } from '../domain/entity/users/password';
import { UserRepository } from '../infra/repositories/user.repository';

type CreateUserUseCaseProps = {
  name: string;
  email: string;
  password: string;
};

type CreateUserUseCaseResponseProps = Either<Error, object>;

@Injectable()
export class CreateUserUseCase implements UseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async perform({
    name,
    email,
    password,
  }: CreateUserUseCaseProps): Promise<CreateUserUseCaseResponseProps> {
    const nameOrError = Name.create(name);
    const emailOrError = Email.create(email);
    const passwordOrError = Password.create(password);

    if (nameOrError.isLeft()) {
      return left(new InvalidNameUserError());
    }

    if (emailOrError.isLeft()) {
      return left(new InvalidUserEmailError(email));
    }

    if (passwordOrError.isLeft()) {
      return left(new InvalidPasswordUserError());
    }

    const userOrError = User.create({
      name: nameOrError.value,
      email: emailOrError.value,
      password: passwordOrError.value,
    });

    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }

    const user = userOrError.value;

    await this.userRepository.create(user);

    return right({});
  }
}
