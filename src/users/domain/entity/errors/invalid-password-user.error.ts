import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class InvalidPasswordUserError extends Error implements UseCaseError {
  constructor() {
    super('A senha informada é invalida');
    this.name = 'InvalidPasswordUserError';
  }
}
