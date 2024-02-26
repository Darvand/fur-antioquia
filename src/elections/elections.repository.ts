import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ElectionSchema, Election } from './models/elections.model';
import { Model } from 'mongoose';

@Injectable()
export class ElectionsRepository {
  constructor(
    @InjectModel(Election.name) private readonly electionModel: Model<Election>,
  ) {}

  getAll(): Promise<Election[]> {
    return this.electionModel.find().exec();
  }
}
