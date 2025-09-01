import { Module } from '@nestjs/common';
import { SendgridService } from './sandgrid.service';

@Module({
  imports: [],
  controllers: [],
  providers: [SendgridService],
  exports: [SendgridService],
})
export class SandgridModule {}
