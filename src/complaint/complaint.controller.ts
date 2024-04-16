import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Complaint,
  ComplaintCategory,
  ComplaintCategoryDocument,
  ComplaintDocument,
} from 'src/complaint/complaint.schema';
import { ComplaintsService } from './complaint.service';
import { EventGateway } from 'src/event/event.gateway';

@Controller('/complaint')
export class ComplaintController {
  constructor(
    @InjectModel(Complaint.name)
    private readonly complaintModel: Model<ComplaintDocument>,
    @InjectModel(ComplaintCategory.name)
    private readonly complaintCategoryModel: Model<ComplaintCategoryDocument>,
    private readonly complaintsService: ComplaintsService,
    private readonly event: EventGateway,
  ) {}

  @Post()
  async createComplaint(@Body() body: any) {
    try {
      await this.complaintModel.create({ ...body });
      return 'created successfully';
    } catch (error) {
      return error;
    }
  }

  @Patch('/:id')
  async updateComplaint(@Param() param: any, @Body() body: any) {
    const { id } = param;
    const { status } = body;

    try {
      const isExist = await this.complaintModel.findById({ _id: id });

      if (isExist) {
        await this.complaintModel.updateOne({ _id: id }, { ...body });

        if (isExist.status !== status) this.event.sendEvent(status);

        return 'complaint updated';
      } else {
        return 'complaint not found';
      }
    } catch (error) {
      return error;
    }
  }

  @Delete('/:id')
  async deleteComplaint(@Param() param: any) {
    const { id } = param;

    try {
      const isExixt = await this.complaintModel.findById({ _id: id });

      if (isExixt) {
        await this.complaintModel.deleteOne({ _id: id });
        return 'delete successfully';
      } else {
        return 'complaint not found';
      }
    } catch (error) {
      return error;
    }
  }

  @Get('/grouped')
  async getComplaintsGroupedByStatus(): Promise<any> {
    return this.complaintsService.getComplaintsGroupedByStatus();
  }

  @Get('/:id')
  async getComplaint(@Param() param: any) {
    const { id } = param;

    try {
      const complaint = await this.complaintModel.findById({ _id: id });

      if (complaint) {
        return complaint;
      } else {
        return 'complaint not found';
      }
    } catch (error) {
      return error;
    }
  }

  //Categories------------------------------------------------------------------------------------------

  @Post('/category')
  async createCategory(@Body() body: any) {
    try {
      await this.complaintCategoryModel.create({ ...body });
      return 'created successfully';
    } catch (error) {
      return error;
    }
  }

  @Patch('/category/:id')
  async updateCategory(@Param() param: any, @Body() body: any) {
    const { id } = param;
    const { status } = body;

    try {
      const isExist = await this.complaintCategoryModel.findById({ _id: id });

      if (isExist) {
        await this.complaintCategoryModel.updateOne({ _id: id }, { ...body });

        return 'category updated';
      } else {
        return 'category not found';
      }
    } catch (error) {
      return error;
    }
  }

  @Delete('/category/:id')
  async deleteCategory(@Param() param: any) {
    const { id } = param;

    try {
      const isExixt = await this.complaintCategoryModel.findById({ _id: id });

      if (isExixt) {
        await this.complaintCategoryModel.deleteOne({ _id: id });
        return 'delete successfully';
      } else {
        return 'category not found';
      }
    } catch (error) {
      return error;
    }
  }

  @Get('/category/:id')
  async getCategory(@Param() param: any) {
    const { id } = param;

    try {
      const complaint = await this.complaintCategoryModel.findById({ _id: id });

      if (complaint) {
        return complaint;
      } else {
        return 'category not found';
      }
    } catch (error) {
      return error;
    }
  }
}
