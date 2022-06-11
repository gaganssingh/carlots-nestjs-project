import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import { APP_PIPE } from '@nestjs/core';
const cookieSession = require('cookie-session');

@Module({
  imports: [
    UsersModule,
    ReportsModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Report],
      synchronize: true, // ⚠️ ONLY USE DURING DEVELOPMENT ⚠️
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      // Validation Pipe (middleware)
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // GLOBALLY SCOPED
    // Cookie session (middleware)
    consumer
      .apply(
        cookieSession({
          keys: ['demoKey'],
        }),
      )
      .forRoutes('*');
  }
}
