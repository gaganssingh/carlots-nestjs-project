import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './report.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private repo: Repository<Report>,
  ) {}

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
