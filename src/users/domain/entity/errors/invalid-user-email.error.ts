import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class InvalidUserEmailError extends Error implements UseCaseError {
  constructor(email: string) {
    super(`O e-mail "${email}" está incorreto`);
    this.name = 'InvalidUserEmailError';
  }
}
