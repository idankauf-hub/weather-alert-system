import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async register(email: string, name?: string) {
    const user = await this.users.findOrCreateByEmail(email, name);
    const token = await this.sign(user._id.toString(), user.email, user.name);
    return { token, user };
  }

  async login(email: string) {
    const user = await this.users.findOrCreateByEmail(email);
    const token = await this.sign(user._id.toString(), user.email, user.name);
    return { token, user };
  }

  private sign(sub: string, email: string, name?: string) {
    return this.jwt.signAsync({ sub, email, name });
  }
}
