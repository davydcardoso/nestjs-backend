import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class InvalidNameUserError extends Error implements UseCaseError {
  constructor() {
    super('Nome informado está invalido');
    this.name = 'InvalidNameUserError';
  }
}
