import { rm } from 'fs/promises';
import { join } from 'path';
import { getConnection } from 'typeorm';

// GLOBAL beforeEach TEST FUNCTION
// DELETE THE TEST DB BEFORE EACH TEST RUN
// TypeORM WILL AUTO-CREATE A NEW TEST FILE
global.beforeEach(async () => {
  // Wrap in a trycatch block, in-case
  // the test file doesn't exist on first run
  try {
    await rm(join(__dirname, '../db.test.sqlite'));
  } catch (error) {}
});

// CLOSE OPEN CONNECTION TO THE DB
// IN BETWEEN EACH TEST
// global.afterEach(async () => {
//   const conn = getConnection('dbconnection');
//   await conn.close();
// });
