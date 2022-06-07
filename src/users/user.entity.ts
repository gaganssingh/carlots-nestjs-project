import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
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
