# Carlots

A used car pricing REST API build using NestJS, and PostgreSQL with TypeScript Support.

## To Start Server:

1. Rename `example.env.development` & `example.env.test` to `.env.development` & `.env.test` respectively.
2. Install dependencies using `npm i`
3. Run server using `npm run start:dev`

## NestJS Operation Flow

```
Client makes request
(E.g. { name: "Test User", email: "test@test.com", password: "123456" })
        ⬇️
NestJS Validation Pipe ➡️ vefirication performed using the DTO
        ⬇️
Domain Controller
(Defines routes. Intercepts request body, query params etc., which is forwaded to the service)
        ⬇️
Domain Service ➡️ Refers the Entity definitions
(Defines the business logic, e.g. fetching all users from the db)
        ⬇️
Domain Repository ➡️ Refers the Entity definitions
(Created by TypeORM in the background, to perform the operations defined the service)
        ⬇️
Database Queries
(Local temp storage, PostgreSQL, SQLite, MongoDB etc.)
```

### Starting a new NestJS app:

- Install the nestjs cli
  `npm i -g @nestjs/cli`
- Generate a new project using nestjs cli
  `nest new <PROJECT_NAME>`

### Validation pipe (request body)

- Validation flow

  ```
  1. A route receives a request with a body.
  2. The validation pipe uses class-transformer to turn body (plain object/json) into an instance of the DTO class.
  3. The validation pipe uses class-validator to validate the request body.
  4. If no errors during validation, request forwarded to request handler.
  4. Is errors during validation, error response sent back to the client.
  ```

- Implementing request body validation:

  1.  Install supporting libs:
      `npm i class-validator class-transformer`
  2.  Configure global validation
      `main.ts`<b>:</b>

      ```
      import { ValidationPipe } from "@nestjs/common";
      .
      .
      .
      async function bootstrap() {
        const app = await NestFactory.create(MessagesModule);

        // Add validation pipe here
        app.useGlobalPipes(new ValidationPipe());

        await app.listen(3000);
      }
      ```

  3.  Create class (DTO) describing properties on req. body to validate:
      `src/messages/dtos/create-message.dto.ts`:

      ```
      export class createMessageDto {
        content: string;
      }

      ```

  4.  Add validation rules:
      `src/messages/dtos/create-message.dto.ts`:

      ```
      import { IsString } from "class-validator";

      export class createMessageDto {
        @IsString()
        content: string;
      }

      ```

  5.  Apply validation class to request handler:
      `src/messages/messages.controller.ts`:

      ```
      @Controller("messages")
      export class MessagesController {
        .
        .
        .

        @Post()
        createMessage(@Body() body: createMessageDto) {
          console.log(body);
        }

        .
        .
        .
      }
      ```

### Implementing current user auth:

```
🚫🚫🚫🚫
  TODO
🚫🚫🚫🚫
```

### Implementing Guards (authenticated route example):

1. Create the class: `src/guards/auth.guard.ts`

   ```
   import { CanActivate, ExecutionContext } from '@nestjs/common';

   export class AuthGuard implements CanActivate {
     canActivate(context: ExecutionContext) {
       // Check if a current user exists
       // on the request body's session
       const request = context.switchToHttp().getRequest();
       return request.session.userId;
     }
   }
   ```

2. Apply to either the whole controller, or individual route handlers:
   ```
   @Get(`/whoami`)
   @UseGuards(AuthGuard)
   whoAmI(@CurrentUser() user: User) {
     return user;
   }
   ```

### Adding a new Entity:

- Install packages: `npm i @nestjs/typeorm typeorm`
- Add the entity definition: `src/users/user.entity.ts`

  ```
  import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

  @Entity()
  export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;
  }
  ```

- Import/Connect entity to the module:
  E.g. `src/users/users.module.ts`
  ```
  @Module({
    imports: [TypeOrmModule.forFeature([User])],  // 🟢 Right here
    controllers: [UsersController],
    providers: [UsersService]
  }
  ```
- Import/Connect entity to the `app.module.ts`
  ```
  TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User], // 🟢 Right here
      synchronize: true,
    }),
  ```

### Using NestJS CLI:

- Module generation:
  `nest generate module cpu`
  E.g. `nest generate module cpu`
  Responds with
  `CREATE src/cpu/cpu.module.ts`
- Service Generation:
  `nest generate service <NAME>`
  E.g.: `nest generate service cpu`
  Responds with:
  ```
  CREATE src/cpu/cpu.service.spec.ts (439 bytes)
  CREATE src/cpu/cpu.service.ts (87 bytes)
  UPDATE src/cpu/cpu.module.ts (151 bytes)
  ```
- Controller generation:
  `nest generate controller <ASSOCIATED_MODULE>/<CONTROLLER_NAME> --flat`
  E.g. `nest generate controller cpu/cpu --flat`
  Responds with
  ```
  CREATE src/cpu/cpu.controller.spec.ts
  CREATE src/cpu/cpu.controller.ts
  UPDATE src/cpu/cpu.module.ts
  ```
- Generate Classes:
  `nest generate class users/dtos/create-user.dto`
  Responds with:
  ```
  CREATE src/users/dtos/create-user.dto.ts
  ```
