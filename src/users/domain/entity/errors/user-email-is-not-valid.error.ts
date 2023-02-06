import { DomainError } from 'src/core/domain/errors/DomainError';

export class UserEmailIsNotValid extends Error implements DomainError {
  constructor() {
    super('O e-mail do usuário informado não é valido!');
    this.name = 'UserEmailIsNotValid';
  }
}
