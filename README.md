# Εισαγωγή στο framework NestJS

## 2. Username and password credentials

Για να υποστηρίζει το backend authentication θα πρέπει στα documents των χρηστών να συμπεριλαμβάνεται ένα πεδίο password. Για να είμαστε επίσης συμβατοί με τη συνήθη ορολογία των αναγνωριστικών πρόσβασης (login credentials) αλλάζουμε το όνομα του πεδίου `id` σε `username` και τον τύπο του από `number` σε `string`. Οι αλλαγές γίνονται τόσο στο σχήμα:

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
@Schema()
export class User {
  @Prop({ type: String, required: true, unique: true }) username: string;
  @Prop({ type: String, required: true }) password: string;
  @Prop({ type: String, required: true }) givenName: string;
  @Prop({ type: String, required: true }) surName: string;
  @Prop({ type: Number, required: true }) age: string;
  @Prop({ type: String, required: true, unique: true }) email: string;
  @Prop({ type: String, required: true }) address: string;
  @Prop({ type: String, default: '' }) photoURL: string;
}
export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
```

όσο και στο DTO:

```typescript
import {
  IsNotEmpty,
  IsEmail,
  IsNumber,
  IsUrl,
  MinLength,
  IsString,
} from 'class-validator';

export class UserDto {
  @IsNotEmpty() @IsString() username: string;
  @IsNotEmpty() @MinLength(8) password: string;
  @IsNotEmpty() givenName: string;
  @IsNotEmpty() surName: string;
  @IsNotEmpty() @IsNumber() age: number;
  @IsNotEmpty() @IsEmail() email: string;
  @IsNotEmpty() address: string;
  @IsUrl() photoURL?: string;
}
```

Στη συνέχεια κάνουμε τις απαραίτητες αλλαγές για το νέο όνομα και τύπο του πεδίου τόσο στο `user.controller.ts`:

```typescript
...
@Get(':username')
async findUserByUsername(@Param('username') username: string) {
  return await this.userService.findUserByUsername(username);
}
...
@Put(':username')
async updateUserByUsername(@Body(new ValidationPipe()) user: UserDto) {
  return await this.userService.updateUserByUsername(user.username, user);
}
...
```

όσο και στο `user.service.ts`:

```typescript
...
async findUserByUsername(username: string): Promise<User> {
  return await this.userModel.findOne({ username }).exec();
}
...
async updateUserByUsername(username: string, user: UserDto): Promise<User> {
  return await this.userModel.findOneAndUpdate({ username }, user).exec();
}
...
```

Στη βάση δεδομένων σώζουμε πάντα τα password κωδικοποιημένα και για να το κάνουμε αυτό χρειαζόμαστε το πακέτο `bcryptjs`:

```
npm i bcryptjs
```

Πριν τα δεδομένα του POST περάσουν στη βάση είναι απαραίτητο να κωδικοποιήσουμε το password στο `user.service.ts`:

```typescript
...
// create service methods

async createUser(user: UserDto): Promise<User> {
  const { password } = user;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new this.userModel({ ...user, password: hashedPassword });
  return await newUser.save();
}
...
```

Για να επιστρέφει το backend ένα επεξηγηματικό μήνυμα λάθους αντί να κάνει exception αλλάζουμε τον controller:

```typescript
...
@Post()
async createUser(@Body(new ValidationPipe()) user: UserDto) {
  try {
    return await this.userService.createUser(user);
  } catch (error) {
    if (error.code === 11000) {
      // MongoDB duplicate key error code:
      throw new HttpException(
        'Username or email already exists',
        HttpStatus.CONFLICT,
      );
    } else {
      throw new HttpException(
        'An unexpected error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
...
```

## 1. User API endpoints

Εγκαθιστούμε δύο plugins του vscode:

![](vsmongo.png)
![](thunder.png)

Με χρήση του MongoDB plugin εισάγουμε τους χρήστες από το αρχείο `src/assets/users.json` στο project `angular-introduction`

```
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('CodingFactory4');

// Create a new document in the collection.
db.getCollection('users').insertMany(
    [
        {
          "id": 1,
          "givenName": "John",
          "surName": "Doe",
          "age": 30,
          "email": "john.doe@example.com",
          "address": "123 Main St",
          "photoURL": "https://i.pravatar.cc/?img=1"
        },
        {
          "id": 2,
          "givenName": "Jane",
          "surName": "Doe",
          "age": 28,
          "email": "jane.doe@example.com",
          "address": "123 Main St",
          "photoURL": "https://i.pravatar.cc/?img=2"
        },
        {
          "id": 3,
          "givenName": "Jim",
          "surName": "Brown",
          "age": "33",
          "email": "jim.brown@example.com",
          "address": "456 Park Ave",
          "photoURL": "https://i.pravatar.cc/?img=3"
        },
        {
          "id": 4,
          "givenName": "Jill",
          "surName": "Brown",
          "age": 42,
          "email": "jill.brown@example.com",
          "address": "456 Park Ave",
          "photoURL": "https://i.pravatar.cc/?img=4"
        },
        {
          "id": 5,
          "givenName": "Jake",
          "surName": "Smith",
          "age": 36,
          "email": "jake.smith@example.com",
          "address": "789 Broadway",
          "photoURL": "https://i.pravatar.cc/?img=5"
        },
        {
          "id": 6,
          "givenName": "Judy",
          "surName": "Smith",
          "age": 34,
          "email": "judy.smith@example.com",
          "address": "789 Broadway",
          "photoURL": "https://i.pravatar.cc/?img=6"
        },
        {
          "id": 7,
          "givenName": "Jack",
          "surName": "Johnson",
          "age": 50,
          "email": "jack.johnson@example.com",
          "address": "321 Oak St",
          "photoURL": "https://i.pravatar.cc/?img=7"
        },
        {
          "id": 9,
          "givenName": "Jerry",
          "surName": "Davis",
          "age": 55,
          "email": "jerry.davis@example.com",
          "address": "654 Pine St",
          "photoURL": "https://i.pravatar.cc/?img=9"
        },
        {
          "id": 10,
          "givenName": "June",
          "surName": "Davis",
          "age": 53,
          "email": "june.davis@example.com",
          "address": "654 Pine St",
          "photoURL": "https://i.pravatar.cc/?img=10"
        },
        {
          "givenName": "Christodoulos",
          "surName": "Fragkoudakis",
          "age": 55,
          "email": "chfrag@aueb.gr",
          "address": "Athens, Greece",
          "photoURL": "https://i.pravatar.cc/?img=22",
          "id": 11
        },
        {
          "id": 13,
          "givenName": "Peter",
          "surName": "Jackson",
          "age": "99",
          "email": "peter@wxample.com",
          "address": "Athens",
          "photoURL": "https://i.pravatar.cc/?img=44"
        },
        {
          "id": 14,
          "givenName": "test",
          "surName": "τεστ",
          "age": "34",
          "email": "skfdhj@dskfh",
          "address": "dsdfs",
          "photoURL": "fsd"
        }
      ]
);
```

Μπορούμε άμεσα να επισκεφτούμε το URL `http://localhost:3000/user` για να πάρουμε τη λίστα όλων των χρηστών.

Υλοποίηση διάφορων GET endpoints:

- `http://localhost:3000/user/:id`
- `http://localhost:3000/user/email/:email`

Για να υλοποιήσουμε το POST και να έχουμε ελέγχους ορθότητας πριν καν τα δεδομένα φτάσουν στο service πρέπει να ορίσουμε Data Transfer Object (DTO) και να εγκαταστήσουμε τα πακέτα `class-validator` και `class-transformer`:

```
npm i class-validator class-transformer
```

Και το DTO για τα αντικείμενα των χρηστών:

```typescript
import { IsNotEmpty, IsEmail, IsNumber, IsUrl } from 'class-validator';

export class UserDto {
  @IsNotEmpty() id: number;
  @IsNotEmpty() givenName: string;
  @IsNotEmpty() surName: string;
  @IsNotEmpty() @IsNumber() age: number;
  @IsNotEmpty() @IsEmail() email: string;
  @IsNotEmpty() address: string;
  @IsUrl() photoURL?: string;
}
```

## 0. Δημιουργία του module users και σύνδεση με την υπηρεσία Atlas

```
❯ nest generate module user
CREATE src/user/user.module.ts (81 bytes)
UPDATE src/app.module.ts (308 bytes)

❯ nest generate controller user
CREATE src/user/user.controller.spec.ts (478 bytes)
CREATE src/user/user.controller.ts (97 bytes)
UPDATE src/user/user.module.ts (166 bytes)

❯ nest generate service user
CREATE src/user/user.service.spec.ts (446 bytes)
CREATE src/user/user.service.ts (88 bytes)
UPDATE src/user/user.module.ts (240 bytes)
```

Εγκατάσταση του `@nestjs/mongoose`:

```
npm i @nestjs/mongoose mongoose
```

Δημιουργία του αρχείου `user.schema.ts` στο κατάλογο `users`:

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
@Schema()
export class User {
  @Prop({ type: String, required: true })
  givenName: string;
  @Prop({ type: String, required: true })
  surName: string;
  @Prop({ type: Number, required: true })
  age: string;
  @Prop({ type: String, required: true, unique: true })
  email: string;
  @Prop({ type: String, required: true })
  address: string;
  @Prop({ type: String, default: '' })
  photoURL: string;
}
export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
```

Χρήση του σχήματος στο `user module`:

```typescript
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
```

Σύνδεση στην υπηρεσία Atlas για τον καθορισμό του connection string:

![](constring.png)

Χρήση του connection string στο app.module.ts:

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://dbadmin:FEyz99503wXyi5K2@cluster0.okry00y.mongodb.net/CodingFactory4?retryWrites=true&w=majority',
    ),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

Έναρξη του development server:

```
❯ nest start
[Nest] 46866  - 10/31/2023, 10:50:47 AM     LOG [NestFactory] Starting Nest application...
[Nest] 46866  - 10/31/2023, 10:50:47 AM     LOG [InstanceLoader] MongooseModule dependencies initialized +24ms
[Nest] 46866  - 10/31/2023, 10:50:47 AM     LOG [InstanceLoader] UserModule dependencies initialized +1ms
[Nest] 46866  - 10/31/2023, 10:50:47 AM     LOG [InstanceLoader] AppModule dependencies initialized +0ms
[Nest] 46866  - 10/31/2023, 10:50:48 AM     LOG [InstanceLoader] MongooseCoreModule dependencies initialized +863ms
[Nest] 46866  - 10/31/2023, 10:50:48 AM     LOG [InstanceLoader] MongooseModule dependencies initialized +9ms
[Nest] 46866  - 10/31/2023, 10:50:48 AM     LOG [RoutesResolver] AppController {/}: +15ms
[Nest] 46866  - 10/31/2023, 10:50:48 AM     LOG [RouterExplorer] Mapped {/, GET} route +4ms
[Nest] 46866  - 10/31/2023, 10:50:48 AM     LOG [RoutesResolver] UserController {/user}: +1ms
[Nest] 46866  - 10/31/2023, 10:50:48 AM     LOG [NestApplication] Nest application successfully started +3ms
```

H βάση και η collection δημιουργήθηκαν:

![](dbcreated.png)

Για να μην κάνουμε push στο GitHub username και password δημιουργούμε ένα αρχείο `src/.env` και εκεί τοποθετούμε τα credentials για την υπηρεσία Atlas:

```
MONGODB_URI=mongodb+srv://dbadmin:FEyz99503wXyi5K2@cluster0.okry00y.mongodb.net/CodingFactory4?retryWrites=true&w=majority
```

**Δεν ξεχνάμε να προσθέσουμε το `.env` στο αρχείο `.gitignore`**

```
.env
# compiled output
/dist
/node_modules
...
```

Εγκαθιστούμε το πακέτο `@nestjs/config`:

```
npm i @nestjs/config
```

Προσθέτουμε στο `app.module.ts`:

```typescript
...
import { ConfigModule } from '@nestjs/config';
...
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
...
```

## -1. Εγκατάσταση και πρώτη εκτέλεση

```
❯ npm i -g @nestjs/cli

added 37 packages, removed 5 packages, and changed 243 packages in 24s

56 packages are looking for funding
  run `npm fund` for details

~/Coding Factory/preparation took 24s
❯ nest new angular-introduction-backend
⚡  We will scaffold your app in a few seconds..

? Which package manager would you ❤️  to use? npm
CREATE angular-introduction-backend/.eslintrc.js (663 bytes)
CREATE angular-introduction-backend/.prettierrc (51 bytes)
CREATE angular-introduction-backend/README.md (3340 bytes)
CREATE angular-introduction-backend/nest-cli.json (171 bytes)
CREATE angular-introduction-backend/package.json (1969 bytes)
CREATE angular-introduction-backend/tsconfig.build.json (97 bytes)
CREATE angular-introduction-backend/tsconfig.json (546 bytes)
CREATE angular-introduction-backend/src/app.controller.ts (274 bytes)
CREATE angular-introduction-backend/src/app.module.ts (249 bytes)
CREATE angular-introduction-backend/src/app.service.ts (142 bytes)
CREATE angular-introduction-backend/src/main.ts (208 bytes)
CREATE angular-introduction-backend/src/app.controller.spec.ts (617 bytes)
CREATE angular-introduction-backend/test/jest-e2e.json (183 bytes)
CREATE angular-introduction-backend/test/app.e2e-spec.ts (630 bytes)

✔ Installation in progress... ☕

🚀  Successfully created project angular-introduction-backend
👉  Get started with the following commands:

$ cd angular-introduction-backend
$ npm run start


                          Thanks for installing Nest 🙏
                 Please consider donating to our open collective
                        to help us maintain this package.


               🍷  Donate: https://opencollective.com/nest
```
