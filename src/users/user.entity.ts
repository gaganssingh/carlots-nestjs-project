import { Report } from 'src/reports/report.entity';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  admin: boolean;

  // Associate the user to reports
  // One user can have many reports
  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  // HOOKS - ONLY executed when .save(), .remove() is called with an entity instance
  @AfterInsert()
  logInsert() {
    console.log(`Inserted user with id: ${this.id}`);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`UPDATED user with id: ${this.id}`);
  }

  @AfterRemove()
  logRemove() {
    console.log(`REMOVED user with id: ${this.id}`);
  }
}
