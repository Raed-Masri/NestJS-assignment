import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Initialize the transporter with your email provider configuration
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use `true` for port 465
      auth: {
        user: 'raedmasri75@gmail.com',
        pass: 'rpxi atpe febk wfty',
      },
    });
  }

  async sendEmail(options: {
    from: string;
    to: string;
    subject: string;
    text: string;
  }): Promise<void> {
    try {
      await this.transporter.sendMail(options);
    } catch (error) {
      throw error;
    }
  }
}
