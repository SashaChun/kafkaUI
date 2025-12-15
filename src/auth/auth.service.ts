import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export type UserRole = 'viewer' | 'operator' | 'admin';

export interface AuthenticatedUser {
  username: string;
  role: UserRole;
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async validateUser(username: string, password: string): Promise<AuthenticatedUser> {
    // In production fetch from persistence or identity provider.
    if (!username || !password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const role: UserRole = username === 'admin' ? 'admin' : 'operator';
    return { username, role };
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    const payload = { sub: user.username, role: user.role };

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' })
    };
  }
}
