import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
<<<<<<< HEAD

@Module({
  imports: [PrismaModule],
  controllers: [AppController],
  providers: [AppService],
=======
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { OtpService } from './modules/otp/otp.service';
import { OtpModule } from './modules/otp/otp.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { join } from 'path';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    OtpModule,
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, OtpService],
>>>>>>> 771f61a3592669018d08c9a677197b198402399b
})
export class AppModule {}
