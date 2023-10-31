import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { UserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // find methods

  async findAllUsers(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findUserById(id: number): Promise<User> {
    return await this.userModel.findOne({ id }).exec();
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email }).exec();
  }

  // create methods

  async createUser(user: UserDto): Promise<User> {
    const newUser = new this.userModel(user);
    return await newUser.save();
  }

  async createUsers(users: UserDto[]): Promise<User[]> {
    const newUsers = users.map((user) => new this.userModel(user));
    return await this.userModel.insertMany(newUsers);
  }
}
