import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Res,
  Post,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ApiCreatedResponse } from '@nestjs/swagger/dist';
import { Response } from 'express';
import { CreateUserRequestProps } from 'src/users/dtos/create-user.dto';
import { CreateUserUseCase } from 'src/users/use-cases/create-user-usecase';

@Controller('users')
export class UsersController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  // @ApiCreatedResponse({ description: 'Usuário criado com sucesso' })
  async create(@Body() body: CreateUserRequestProps) {
    const { name, email, password } = body;

    const result = await this.createUserUseCase.perform({
      name,
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        default:
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }
}
