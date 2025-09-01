import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestModule } from 'src/test/test.module';
import { UserModule } from 'src/user/user.module';
import { UrlSigningService } from './urlSigning.service';
import { UrlSigningController } from './urlSigning.controller';
import { Test } from 'src/test/test.entity';
import { TestAttempt } from 'src/test/testAttempt.entity';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => UserModule),
    TestModule,
    TypeOrmModule.forFeature([Test, TestAttempt]),
  ],
  providers: [UrlSigningService],
  controllers: [UrlSigningController],
  exports: [UrlSigningService],
})
export class UrlSigningModule {}
