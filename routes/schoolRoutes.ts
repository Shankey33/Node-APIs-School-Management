import { Router } from "express";
import { SchoolController } from "../controllers/schoolController";
import { SchoolRepository } from "../repositories/schoolRepository";
import { SchoolService } from "../services/schoolService";
import {
  validate,
  addSchoolSchema,
  listSchoolsSchema,
} from "../middlewares/validator";

const router = Router();
const schoolRepository = new SchoolRepository();
const schoolService = new SchoolService(schoolRepository);
const schoolController = new SchoolController(schoolService);

router.post(
  "/addSchool",
  validate(addSchoolSchema, "body"),
  schoolController.addSchool.bind(schoolController)
);

router.get(
  "/listSchools",
  validate(listSchoolsSchema, "query"),
  schoolController.listSchools.bind(schoolController)
);

export default router;
