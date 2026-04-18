import { Request, Response, NextFunction } from "express";
import { SchoolService } from "../services/schoolService";

const sendSuccess = (
  res: Response,
  message: string,
  data: any,
  statusCode: number = 200
) => {
  res.status(statusCode).json({ success: true, message, data });
};

const sendError = (
  res: Response,
  message: string,
  statusCode: number = 400,
  details: any = null
) => {
  const body: any = { success: false, message };
  if (details) body.details = details;
  res.status(statusCode).json(body);
};

export class SchoolController {
  constructor(private schoolService: SchoolService) {}

  public async addSchool(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name, address, latitude, longitude } = req.validated;

      const school = await this.schoolService.addSchool({ name, address, latitude, longitude });

      return sendSuccess(res, "School added successfully", school, 201);
    } catch (error: any) {
      if (error.statusCode === 409) {
        return sendError(res, error.message, 409);
      }
      next(error);
    }
  }

  public async listSchools(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { latitude, longitude } = req.validated;

      const sortedSchools = await this.schoolService.listSchools(latitude, longitude);

      if (sortedSchools.length === 0) {
        return sendSuccess(res, "No schools found", []);
      }

      return sendSuccess(
        res,
        `${sortedSchools.length} school(s) retrieved, sorted by proximity`,
        sortedSchools
      );
    } catch (error: any) {
      next(error);
    }
  }
}
