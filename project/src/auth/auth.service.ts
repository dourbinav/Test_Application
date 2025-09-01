import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { AdminService } from 'src/admin/admin.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private adminService: AdminService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    console.log('Creating user with data:', createUserDto);
    const userResult = await this.adminService.createAdmin({
      email: createUserDto.email,
      password: createUserDto.password,
    });
    const user = Array.isArray(userResult) ? userResult[0] : userResult;
    console.log('Admin created:', user);

    // Use user.userId and user.email for token generation

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async login(createUserDto: CreateUserDto) {
    const user = await this.adminService.findByEmail(createUserDto.email);
    if (!user) {
      throw new ForbiddenException('Access Denied');
    }
    const passwordMatches = createUserDto.password === user.password;
    if (!passwordMatches) {
      throw new ForbiddenException('Access Denied');
    }
    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  // Refresh tokens

  async refreshTokens(userId: string, refreshToken: string) {
    console.log('Refreshing tokens for user:', refreshToken);
    const user = await this.adminService.findById(userId);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      `${user.refreshToken}`,
    );
    if (!isRefreshTokenMatching) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.generateTokens(user.password, user.email);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    await this.updateRefreshToken(user.email, tokens.refreshToken);
    return tokens;
  }

  // Helper to store hashed refresh token
  async updateRefreshToken(userId: any, refreshToken: string) {
    console.log(
      `Updating refresh token for user ${userId},refreshToken:${refreshToken}`,
    );
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.adminService.updateUserRefreshToken(userId, hashedRefreshToken);
  }

  // Helper to generate both tokens
  async generateTokens(userId: any, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      // Access Token
      this.jwtService.signAsync(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        { sub: userId, username },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION'),
        },
      ),
      // Refresh Token
      this.jwtService.signAsync(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        { sub: userId, username },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }
}
