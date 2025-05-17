import { Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../dto';
import { ModelJSON } from '../databases';

export class ResponseMapper {
  private static instance: ResponseMapper;
  private constructor() {}

  public static getInstance(): ResponseMapper {
    if (!ResponseMapper.instance) {
      ResponseMapper.instance = new ResponseMapper();
    }
    return ResponseMapper.instance;
  }

  public success<T>(
    res: Response,
    data: T | T[],
    message: string = 'Success',
    statusCode: number = 200
  ): Response {
    const response = {
      status: 'success',
      message,
      data: Array.isArray(data) ? { items: data } : { item: data },
    };

    return res.status(statusCode).json(response);
  }

  public error(
    res: Response,
    message: string = 'Error',
    statusCode: number = 400,
    errors?: any
  ): Response {
    const response = {
      status: 'error',
      message,
      ...(errors && { errors }),
    };

    return res.status(statusCode).json(response);
  }

  public mapUser(user: ModelJSON<any>): UserResponseDto {
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  public mapUsers(users: ModelJSON<any>[]): UserResponseDto[] {
    return users.map(user => this.mapUser(user));
  }

  public created<T>(res: Response, data: T, message: string = 'Created successfully'): Response {
    return this.success(res, data, message, 201);
  }

  public noContent(res: Response): Response {
    return res.status(204).send();
  }

  public notFound(res: Response, message: string = 'Resource not found'): Response {
    return this.error(res, message, 404);
  }

  public unauthorized(res: Response, message: string = 'Unauthorized'): Response {
    return this.error(res, message, 401);
  }

  public forbidden(res: Response, message: string = 'Forbidden'): Response {
    return this.error(res, message, 403);
  }

  public validationError(res: Response, errors: any): Response {
    return this.error(res, 'Validation Error', 422, errors);
  }
} 