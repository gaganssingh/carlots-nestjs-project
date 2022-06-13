import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { Report } from './report.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private repo: Repository<Report>,
  ) {}

  createEstimate(estimateDto: GetEstimateDto) {
    const { make, model, lng, lat, year, mileage } = estimateDto;
    return (
      this.repo
        .createQueryBuilder()
        .select(`AVG(price)`, `price`)
        .where(`make=:make`, { make })
        .andWhere(`model=:model`, { model })
        // Lng between +/- 5 deg
        .andWhere(`lng - :lng BETWEEN -5 AND 5`, { lng })
        // Lat between +/- 5 deg
        .andWhere(`lat - :lat BETWEEN -5 AND 5`, { lat })
        // Year between +/- 3 years
        .andWhere(`year - :year BETWEEN -3 AND 3`, { year })
        // Only show approved listings
        .andWhere(`approved IS TRUE`)
        // Sort by mileage
        .orderBy(`ABS(mileage - :mileage)`, `DESC`)
        .setParameters({ mileage })
        // Only get 3 results
        .limit(3)
        .getRawOne()
    );
  }

  create(reportDto: CreateReportDto, user: User) {
    // Create the report instance that is to be save in the db
    const report = this.repo.create(reportDto);

    // Associate this report to the signed in user
    report.user = user;

    // Save the new report instance to the db
    return this.repo.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.repo.findOne({
      where: { id: +id },
    });
    if (!report) {
      throw new NotFoundException(`report with id ${id} not found`);
    }

    report.approved = approved;
    return this.repo.save(report);
  }
}
