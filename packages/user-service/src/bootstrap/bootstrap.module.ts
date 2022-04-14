import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@sonyahon/config';
import { AppConfig } from '../config/app.config';
import {
  MongooseRefreshToken,
  RefreshTokenSchema,
} from '../schemas/refresh-token.schema';
import { MongooseUser, UserSchema } from '../schemas/user.schema';
import { CryptoService } from '../services/crypto/crypto.service';
import { RefreshTokenService } from '../services/refresh-token/refresh-token.service';
import { UserService } from '../services/user/user.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://dragonzo_mongodb/user-service'),
    MongooseModule.forFeature([
      { name: MongooseUser.name, schema: UserSchema },
      { name: MongooseRefreshToken.name, schema: RefreshTokenSchema },
    ]),
    ConfigModule.forRoot([AppConfig], {
      defineGlobal: true,
    }),
  ],
  providers: [UserService, CryptoService, RefreshTokenService],
})
export class BootstrapModule implements OnApplicationBootstrap {
  static async Bootstrap() {
    const app = await NestFactory.create(BootstrapModule, {});
    app.connectMicroservice({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://dragonzo_rabbitmq:5672'],
        queue: 'user-service',
      },
    });
    return app;
  }

  constructor(private readonly userService: UserService) {}

  async onApplicationBootstrap() {
    await this.userService.createDefaultRootIfNotExist();
  }
}
