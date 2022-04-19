import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@sonyahon/config';

import { PrismaAdapter } from '../adapters/database/prisma.adapter';
import { UserRepositoryAdapter } from '../adapters/database/user-repository.adapter';
import { AuthenticateUserService } from '../application/services/authenticate-user.service';
import { CreateUserService } from '../application/services/create-user.service';
import { EncryptPasswordService } from '../application/services/encrypt-password.service';
import { FindUserService } from '../application/services/find-user.service';
import { GenerateJWTService } from '../application/services/generate-jwt.service';
import { GenerateTokenPairService } from '../application/services/generate-token-pair.service';
import { ValidateUserPasswordService } from '../application/services/validate-user-password.service';
import { SecurityConfig } from '../config/security.config';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot([SecurityConfig], {
      defineGlobal: true,
    }),
  ],
  providers: [
    PrismaAdapter,
    UserRepositoryAdapter,
    AuthenticateUserService,
    CreateUserService,
    EncryptPasswordService,
    FindUserService,
    GenerateJWTService,
    GenerateTokenPairService,
    ValidateUserPasswordService,
  ],
})
export class BootstrapModule {}
