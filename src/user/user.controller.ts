import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import * as nodemailer from 'nodemailer';
import { User, UserDocument } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp, OtpDocument } from 'src/otp/otp.schema';
import { EmailService } from './email.service';
import { UsersService } from './user.service';
import { CreateUserDto } from './userDTO';

@Controller('user')
export class UserController {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Otp.name) private readonly otpModel: Model<OtpDocument>,
    private readonly usersService: UsersService,
  ) {}

  @Post('/sign-up')
  async createUser(@Body() createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    try {
      const isExist = await this.userModel.findOne({ email: email }); //email in the database equal to the received email

      if (isExist) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        await this.userModel.create({
          ...createUserDto,
          password: hashedPassword,
        });
        return 'Sign up successfull';
      }
    } catch (error) {
      return error;
    }
  }

  @Post('/sign-in/:userType')
  async signIn(@Body() body: any, @Param() param: any) {
    const { email, password } = body;
    const { userType } = param;

    try {
      const user = await this.userModel.findOne({ email });

      if (user) {
        const isCmsUser = ['admin', 'employee'].includes(user?.userType);
        if (isCmsUser && userType !== 'cms') {
          return 'Not a regular user';
        } else if (!isCmsUser && userType === 'cms') {
          return 'Not Cms user';
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (isPasswordMatch) {
          if (user.isActive === true) {
            return 'Login Successfull';
          } else {
            return 'Cannot login, account inactive';
          }
        } else {
          return 'Password Incorrect';
        }
      } else {
        return 'User Not Found';
      }
    } catch (error) {
      return error;
    }
  }

  @Patch('/:id')
  async activateUser(@Param() param: any, @Body() body: any) {
    const { id } = param;

    try {
      const isExist = await this.userModel.findById({ _id: id });

      if (isExist) {
        await this.userModel.updateOne({ _id: id }, { ...body });

        return 'User updated';
      } else {
        return 'User not found';
      }
    } catch (error) {
      return error;
    }
  }

  @Post('/reset-password')
  async resetPass(@Body() body: any) {
    const { email, password } = body;

    try {
      const user = await this.userModel.findOne({ email });

      if (user) {
        const hashedPassword = await bcrypt.hash(password, 10);

        await this.userModel.updateOne({ email }, { password: hashedPassword });

        return 'Password reset successfully';
      } else {
        return 'User not found';
      }
    } catch (error) {
      return error;
    }
  }

  @Get('/details')
  async getCategory(@Param() param: any) {
    try {
      const user = await this.userModel.find({
        userType: { $in: ['employee', 'admin'] },
      });

      if (user) {
        return user;
      } else {
        return 'users not found';
      }
    } catch (error) {
      return error;
    }
  }

  @Delete('/delete/:email/')
  async deleteUser(@Param() param: any) {
    const { email } = param;
    const user = await this.userModel.findOne({ email });

    if (user) {
      await this.userModel.deleteOne({ email });
      return 'Deleted';
    } else {
      return 'Cannot delete';
    }
  }

  @Post('/send-otp/:email')
  async sendOTP(@Param() Param: any) {
    const { email } = Param;

    try {
      const secret = speakeasy.generateSecret({ length: 20 });
      const otp = speakeasy.totp({
        secret: secret.base32,
        encoding: 'base32',
      });
      const expiry = new Date(Date.now() + 10 * 60 * 1000); // should be expired after 10 mins

      await this.otpModel.create({ otp, expiry }); //save otp in database
      const emailService = new EmailService();
      await emailService.sendEmail({
        from: 'Raed',
        to: email,
        subject: 'OTP',
        text: `Your OTP is ${otp}`,
      });

      return 'OTP sent';
    } catch (error) {
      return error;
    }
  }

  @Post('/verify-otp/:otp')
  async verifyOTP(@Param() Param: any) {
    const { otp } = Param;

    try {
      const isOtpExist = await this.otpModel.findOne({ otp: otp });

      if (isOtpExist) {
        if (new Date() < isOtpExist.expiry) {
          return 'valid OTP';
        } else {
          return 'expired OTP';
        }
      } else {
        return 'invalid OTP';
      }
    } catch (error) {
      return error;
    }
  }

  @Get('/')
  async usersPaginated(@Query() query: any, @Req() req: Request) {
    const { page, limit } = query;

    //const role = user?.role;
    try {
      const pageNbr = parseInt(page) || 1;
      const pageSize = parseInt(limit) || 10;
      const skip = (pageNbr - 1) * pageSize;
      const users = await this.userModel
        .find({ userType: { $in: ['employee', 'admin'] } })
        .skip(skip)
        .limit(pageSize);
      const totalCount = await this.userModel.countDocuments();
      const totalPages = Math.ceil(totalCount / pageSize);

      return {
        users,
        totalPages,
        currentPage: parseInt(page),
        pageSize,
      };
    } catch (error) {
      return error;
    }
  }
}
