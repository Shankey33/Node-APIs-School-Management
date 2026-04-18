import { PrismaClient } from "@prisma/client";
import { School } from "../models/schoolModel";
import 'dotenv/config';

const prisma = new PrismaClient();

export class SchoolRepository {
  public async createSchool({
    name,
    address,
    latitude,
    longitude,
  }: School): Promise<School> {
    const newSchool = await prisma.school.create({
      data: {
        name,
        address,
        latitude,
        longitude,
      },
    });
    return newSchool as School;
  }

  public async getAllSchools(): Promise<School[]> {
    const schools = await prisma.school.findMany({
      orderBy: { id: "asc" },
    });
    return schools as School[];
  }

  public async getSchoolById(id: number): Promise<School | null> {
    const school = await prisma.school.findUnique({
      where: { id },
    });
    return (school as School) ?? null;
  }

  public async schoolExistsByName(name: string): Promise<boolean> {
    const count = await prisma.school.count({
      where: { name },
    });
    return count > 0;
  }
}
