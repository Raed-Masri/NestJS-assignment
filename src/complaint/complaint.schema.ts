import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ComplaintDocument = Complaint & Document;
export type ComplaintCategoryDocument = ComplaintCategory & Document;

@Schema()
export class Complaint {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [Types.ObjectId], ref: 'Complaint-Category' })
  categories: ComplaintCategory[];

  @Prop({
    type: String,
    enum: ['PENDING', 'INPROGRESS', 'RESOLVED', 'REJECTED'],
    default: 'PENDING',
  })
  status: string;
}

export const ComplaintSchema = SchemaFactory.createForClass(Complaint);

ComplaintSchema.pre<Complaint & Document>('save', async function (next) {
  try {
    const ComplaintModel = this.model('Complaint');
    const complaintCount = await ComplaintModel.countDocuments();
    this.title += `#${complaintCount + 1}`;
    next();
  } catch (err) {
    next(err);
  }
});

@Schema()
export class ComplaintCategory {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  description: string;
}

export const ComplaintCategorySchema =
  SchemaFactory.createForClass(ComplaintCategory);
