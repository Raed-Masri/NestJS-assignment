import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Complaint } from './complaint.schema';


@Injectable()
export class ComplaintsService {
  constructor(
    @InjectModel(Complaint.name)
    private readonly complaintModel: Model<Complaint>,
  ) {}

  async getComplaintsGroupedByStatus(): Promise<any> {
    try {
      const groupedComplaints = await this.complaintModel.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            complaints: {
              $push: {
                title: '$title',
                description: '$description',
                categories: '$categories',
              },
            },
          },
        },
        {
          $project: {
            status: '$_id',
            count: 1,
            complaints: 1,
          },
        },
      ]);

      return groupedComplaints;
    } catch (error) {
      console.error('Error grouping complaints by status:', error);
      throw error;
    }
  }
}
