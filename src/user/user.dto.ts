import {
  IsNotEmpty,
  IsEmail,
  IsString,
  IsNumber,
  IsUrl,
  MinLength,
} from 'class-validator';

export class UserDto {
  @IsNotEmpty() @IsString() username: string;
  @IsNotEmpty() @IsString() @MinLength(8) password: string;
  @IsNotEmpty() givenName: string;
  @IsNotEmpty() surName: string;
  @IsNotEmpty() @IsNumber() age: number;
  @IsNotEmpty() @IsEmail() email: string;
  @IsNotEmpty() address: string;
  @IsUrl() photoURL?: string;
}
