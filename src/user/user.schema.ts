import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ collection: 'users' }) 
export class User {
  @Prop({ required: true, unique: true }) 
  email: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true }) 
  lastName: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false }) 
  isVip: boolean;

  @Prop({ default: 'user' })
  userType: string

  @Prop({ default: true }) 
  isActive: boolean;
}

// Create the schema for the User class
export const UserSchema = SchemaFactory.createForClass(User);
