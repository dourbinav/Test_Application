import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './Strategy/access.token.strategy';
import { RefreshTokenStrategy } from './Strategy/refresh.token.strategy';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // Ensure ConfigModule is imported
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret123',
      signOptions: { expiresIn: '1h' },
    }),
    UserModule,
    AdminModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    AuthGuard,
  ],
  exports: [AuthGuard, AuthService],
})
export class AuthModule {}
