import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Complaint,
  ComplaintSchema,
  ComplaintCategory,
  ComplaintCategorySchema,
} from './complaint.schema';
import { ComplaintController } from './complaint.controller';
import { ComplaintsService } from './complaint.service';
import { EventGateway } from 'src/event/event.gateway';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Complaint.name, schema: ComplaintSchema },
      { name: ComplaintCategory.name, schema: ComplaintCategorySchema },
      
    ]),
  ],
  controllers: [ComplaintController],
   providers: [ComplaintsService, EventGateway],
   exports:[ComplaintsService]
})
export class ComplaintModule {}
