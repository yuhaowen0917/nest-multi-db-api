import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SequelizeTestService } from './sequelize-test.service';
import { SequelizeTestController } from './sequelize-test.controller';
import { TestSequelize } from './entities/test-sequelize.entity';

@Module({
  imports: [SequelizeModule.forFeature([TestSequelize])],
  controllers: [SequelizeTestController],
  providers: [SequelizeTestService],
})
export class SequelizeTestModule {}
