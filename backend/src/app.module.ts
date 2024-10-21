import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { MemberModule } from './modules/member/member.module';
import { CompanyModule } from './modules/company/company.module';
import { DoctorModule } from './modules/doctor/doctor.module';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { DatabaseModule } from './database/database.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    UserModule,
    CompanyModule,
    MemberModule,
    DoctorModule,
    AppointmentModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
