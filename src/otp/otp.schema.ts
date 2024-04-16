import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OtpDocument = Otp & Document;

@Schema()
export class Otp {
  @Prop({ required: true })
  otp: string;

  @Prop({ required: true })
  expiry: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
