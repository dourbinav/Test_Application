import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SandgridModule } from './integration/sandgrid/sandgrid.module';
import { UrlSigningModule } from './urlSigning/urlSigning.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TestModule } from './test/test.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // or mysql/sqlite
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'sample',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UrlSigningModule,
    TestModule,
    SandgridModule,
    AuthModule,
    UserModule,
    AdminModule,
    ConfigModule.forRoot({
      isGlobal: true, // Makes the ConfigModule available globally
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
