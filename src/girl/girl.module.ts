/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { GirlController } from './girl.controller';
import { GirlService } from './girl.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Girl } from './entities/girl.entities';

@Module({
  imports: [TypeOrmModule.forFeature([Girl])],
  controllers: [GirlController],
  providers: [
    {
      provide: 'girl',
      useClass: GirlService,
    },
    {
      provide: 'girlArray',
      useValue: ['小红', '小翠', '大牙'],
    },
    {
      provide: 'MyFactory',
      useFactory() {
        console.log('-----------MyFactory---------');
        return 'console.log() function';
      },
    },
  ],
})
export class GirlModule {}
