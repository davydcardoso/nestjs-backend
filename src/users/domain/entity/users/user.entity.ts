import { Entity } from 'src/core/domain/entity';
import { Either, right } from 'src/core/logic/Either';
import { Email } from './email';
import { Name } from './name';
import { Password } from './password';

type UserProps = {
  name: Name;
  email: Email;
  password: Password;
};

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  private constructor(props: UserProps, id?: string) {
    super(props, id);
  }

  static create(props: UserProps, id?: string): Either<Error, User> {
    const user = new User(props, id);

    return right(user);
  }
}
