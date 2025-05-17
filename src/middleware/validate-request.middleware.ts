import { Request, Response, NextFunction } from "express";
import { validate, ValidationError } from "class-validator";
import { plainToInstance } from "class-transformer";
import { AppError } from "./error-handler.middleware";

type ValidationType = "body" | "query" | "params";

interface ValidationOptions {
  body?: any;
  query?: any;
  params?: any;
}

const transformQueryParams = (data: Record<string, any>): Record<string, any> => {
  return Object.entries(data).reduce((acc, [key, value]) => {
    acc[key] = typeof value === 'string' && !isNaN(Number(value)) ? Number(value) : value;
    return acc;
  }, {} as Record<string, any>);
};

const extractErrorMessages = (errors: ValidationError[]): string[] => {
  return errors
    .map(error => error.constraints ? Object.values(error.constraints) : [])
    .flat();
};

export const validateRequest = (options: ValidationOptions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      for (const [type, dtoClass] of Object.entries(options)) {
        if (!dtoClass) continue;

        const requestData = req[type as ValidationType];
        if (!requestData) {
          throw new AppError(`No ${type} data provided`, 400);
        }

        const transformedData = type === "query" ? transformQueryParams(requestData) : requestData;
        const dtoObject = plainToInstance(dtoClass, transformedData);
        const errors = await validate(dtoObject);

        if (errors.length > 0) {
          throw new AppError(extractErrorMessages(errors).join(", "), 400);
        }

        req[type as ValidationType] = dtoObject;
      }

      next();
    } catch (error) {
      next(error instanceof AppError ? error : new AppError("Validation failed", 400));
    }
  };
};
