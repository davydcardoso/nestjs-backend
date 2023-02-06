import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class AlreadyExistsUserAccountError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('Já existe um usuário cadastrado com estes dados');
    this.name = 'AlreadyExistsUserAccountError';
  }
}
