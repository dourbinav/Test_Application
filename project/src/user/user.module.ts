import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SandgridModule } from 'src/integration/sandgrid/sandgrid.module';
import { UrlSigningModule } from 'src/urlSigning/urlSigning.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Test } from 'src/test/test.entity';

@Module({
  imports: [
    SandgridModule,
    forwardRef(() => UrlSigningModule),
    TypeOrmModule.forFeature([User, Test]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
