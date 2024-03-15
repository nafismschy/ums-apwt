import { Module } from '@nestjs/common';
import { FacultyService } from './faculty.service';
import { FacultyController } from './faculty.controller';
import { FacultyEntity } from './entities/faculty.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FacultyEntity]),
    JwtModule.register({
      global: true,
      secret: 'UMS-APWT',
      signOptions: { expiresIn: '30m' },
    }),
  ],
  controllers: [FacultyController],
  providers: [FacultyService, AuthService],
  exports: [FacultyService],
})
export class FacultyModule {}
