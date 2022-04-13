import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MongooseRefreshToken,
  RefreshTokenSchema,
} from 'src/schemas/refresh-token.schema';
import { MongooseUser, UserSchema } from 'src/schemas/user.schema';
import { CryptoService } from 'src/services/crypto/crypto.service';
import { UserService } from 'src/services/user/user.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://dragonzo_mongodb/user-service'),
    MongooseModule.forFeature([
      { name: MongooseUser.name, schema: UserSchema },
      { name: MongooseRefreshToken.name, schema: RefreshTokenSchema },
    ]),
  ],
  providers: [UserService, CryptoService],
})
export class BootstrapModule {}
