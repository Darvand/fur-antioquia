import { Module } from '@nestjs/common';
import { ElectionsService } from './elections.service';
import { ElectionsRepository } from './elections.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Election, ElectionSchema } from './models/elections.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Election.name, schema: ElectionSchema },
    ]),
  ],
  providers: [ElectionsService, ElectionsRepository],
  exports: [ElectionsService],
})
export class ElectionsModule {}
