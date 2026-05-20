import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MapService } from './map.service';
import { MapController } from './map.controller';
import { MapData } from './map-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MapData])],
  controllers: [MapController],
  providers: [MapService],
})
export class MapModule {}
