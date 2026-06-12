import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PgService } from './pg.service';
import { PgController } from './pg.controller';
import { PgData } from './entities/pg-data.entity';

@Module({
  imports: [SequelizeModule.forFeature([PgData], 'postgres')],
  controllers: [PgController],
  providers: [PgService],
})
export class PgModule {}
