import { compare, hash } from 'bcryptjs';
import { Either, left, right } from 'src/core/logic/Either';
import { InvalidPasswordUserError } from '../errors/invalid-password-user.error';

export class Password {
  private readonly password: string;
  private readonly hashed?: boolean;

  private constructor(value: string, hashed: boolean) {
    this.password = value;
    this.hashed = hashed;
  }

  static validate(value: string): boolean {
    if (!value || value.trim().length < 6 || value.trim().length > 255) {
      return false;
    }

    const regex = /((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,}))/;

    if (!regex.test(value)) {
      return false;
    }

    return true;
  }

  public async getHashedValue(): Promise<string> {
    if (this.hashed) {
      return this.password;
    }

    return await hash(this.password, 8);
  }

  public async comparePassword(plainTextPassword: string): Promise<boolean> {
    let hashed: string;

    if (this.hashed) {
      hashed = this.password;

      return await compare(plainTextPassword, hashed);
    }

    return this.password === plainTextPassword;
  }

  static create(
    value: string,
    hashed: boolean = false,
  ): Either<InvalidPasswordUserError, Password> {
    if (!this.validate(value)) {
      return left(new InvalidPasswordUserError());
    }

    return right(new Password(value, hashed));
  }
}
