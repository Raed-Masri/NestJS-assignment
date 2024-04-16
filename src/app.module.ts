import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ComplaintModule } from './complaint/complaint.module';
import { EventModule } from './event/event.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './authentication/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nest'),
    UserModule,
    ComplaintModule,
    EventModule,
    JwtModule.register({
      secret: 'raed123', // Replace with your own secret key
      signOptions: { expiresIn: '1h' }, // Token expiration time
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
