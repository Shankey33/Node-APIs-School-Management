import { SchoolRepository } from "../repositories/schoolRepository";
import { School } from "../models/schoolModel";
import { sortSchoolsByDistance } from "../utils/geoHelper";

export class SchoolService {
  constructor(private schoolRepository: SchoolRepository) {}

  public async addSchool(schoolData: School): Promise<School> {
    const isDuplicate = await this.schoolRepository.schoolExistsByName(schoolData.name);
    if (isDuplicate) {
      const error = new Error(`A school named "${schoolData.name}" already exists.`);
      (error as any).statusCode = 409;
      throw error;
    }

    return await this.schoolRepository.createSchool(schoolData);
  }

  public async listSchools(latitude: number, longitude: number): Promise<any[]> {
    const schools = await this.schoolRepository.getAllSchools();
    if (schools.length === 0) {
      return [];
    }

    return sortSchoolsByDistance(schools, latitude, longitude);
  }
}
