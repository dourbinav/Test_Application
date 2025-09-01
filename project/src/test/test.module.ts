import { forwardRef, Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { UrlSigningModule } from 'src/urlSigning/urlSigning.module';
import { UserModule } from 'src/user/user.module';
import { Question } from './question.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test } from './test.entity';
import { User } from 'src/user/user.entity';
import { TestAttempt } from './testAttempt.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, Test, User, TestAttempt]),
    forwardRef(() => UrlSigningModule),
    forwardRef(() => UserModule),
  ],
  controllers: [TestController],
  providers: [TestService],
  exports: [TestService],
})
export class TestModule {}
