import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findById(id: string) {
    return this.userModel.findById(id).lean();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email: email.toLowerCase().trim() }).lean();
  }

  async findOrCreateByEmail(email: string, name?: string) {
    const lowerCaseEmail = email.toLowerCase().trim();
    const existing = await this.userModel
      .findOne({ email: lowerCaseEmail })
      .lean();
    if (existing) return existing;
    const created = await this.userModel.create({
      email: lowerCaseEmail,
      name: name?.trim() || undefined,
    });
    return created.toObject();
  }
}
