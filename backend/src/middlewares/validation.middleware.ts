import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ZodSchema } from 'zod';

const validate =
  (rawSchema: ZodSchema): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    const parsedSafely = rawSchema.safeParse(req);
    if (!parsedSafely.success) {
      console.log(parsedSafely.error.errors, 'validation errors');
      throw new Error(
        `Error occured in Validating Schema, exception_message: ${parsedSafely.error.errors[0].message}`,
      );
    }
    return next();
  };
export default {
  validate,
};
