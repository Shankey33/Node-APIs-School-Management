import { Request, Response, NextFunction, RequestHandler } from "express";
import { z, AnyZodObject, ZodSchema } from "zod";

declare global {
  namespace Express {
    interface Request {
      validated?: any;
    }
  }
}

export const addSchoolSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(255, "Name must not exceed 255 characters"),
  address: z
    .string({ required_error: "Address is required" })
    .trim()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address must not exceed 500 characters"),
  latitude: z
    .number({
      required_error: "Latitude is required",
      invalid_type_error: "Latitude must be a number",
    })
    .min(-90, "Latitude must be between –90 and +90")
    .max(90, "Latitude must be between –90 and +90"),
  longitude: z
    .number({
      required_error: "Longitude is required",
      invalid_type_error: "Longitude must be a number",
    })
    .min(-180, "Longitude must be between –180 and +180")
    .max(180, "Longitude must be between –180 and +180"),
});

export const listSchoolsSchema = z.object({
  latitude: z
    .string({ required_error: "Query param 'latitude' is required" })
    .transform((val) => parseFloat(val))
    .pipe(
      z
        .number({ invalid_type_error: "Latitude must be a valid number" })
        .min(-90, "Latitude must be between –90 and +90")
        .max(90, "Latitude must be between –90 and +90")
    ),
  longitude: z
    .string({ required_error: "Query param 'longitude' is required" })
    .transform((val) => parseFloat(val))
    .pipe(
      z
        .number({ invalid_type_error: "Longitude must be a valid number" })
        .min(-180, "Longitude must be between –180 and +180")
        .max(180, "Longitude must be between –180 and +180")
    ),
});

export const validate = (
  schema: ZodSchema<any>,
  target: "body" | "query" | "params" = "body"
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path.join(".") || target,
        message: err.message,
      }));

      res.status(422).json({
        success: false,
        message: "Validation failed. Please check your input.",
        errors,
      });
      return;
    }

    req.validated = result.data;
    next();
  };
};
