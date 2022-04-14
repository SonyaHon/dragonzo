import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectValue } from '@sonyahon/config';
import { sign } from 'jsonwebtoken';
import { Model } from 'mongoose';
import { AppConfig } from '../../config/app.config';
import {
  MongooseUser,
  UserDocument,
  UserRole,
} from '../../schemas/user.schema';
import { CryptoService } from '../crypto/crypto.service';
import { PasswordsDoNotMatchException } from '../crypto/crypto.service.exceptions';
import { InvalidRefreshTokenException } from '../refresh-token/refresh-token.exceptions';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import {
  DublicatedUserException,
  InvalidCredentialsException,
  UserNotFoundException,
} from './user.service.exceptions';

export interface ITokens {
  access: string;
  refresh: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectModel(MongooseUser.name)
    private readonly userModel: Model<UserDocument>,
    private readonly cryptoService: CryptoService,
    private readonly refreshTokenService: RefreshTokenService,
    @InjectValue(AppConfig, 'jwtSignSecret')
    private readonly jwtSignPrivateKey: string,
    @InjectValue(AppConfig, 'jwtExpiration')
    private readonly jwtExpiration: number,
    @InjectValue(AppConfig, 'defaultRootUsername')
    private readonly rootUsername: string,
    @InjectValue(AppConfig, 'defaultRootPassword')
    private readonly rootPassword: string,
  ) {}

  async createUser(
    username: string,
    rawPassword: string,
    role?: UserRole,
  ): Promise<UserDocument> {
    try {
      const doc = new this.userModel({
        username,
        password: await this.cryptoService.hash(rawPassword),
        role: role || UserRole.User,
      });
      await doc.save();
      return doc;
    } catch (error) {
      if (
        'code' in error &&
        error.code === 11000 &&
        'keyPattern' in error &&
        error.keyPattern.username === 1
      ) {
        throw new DublicatedUserException();
      }
      throw error;
    }
  }

  async findUserByUsername(username: string): Promise<UserDocument> {
    const document = await this.userModel.findOne({ username });
    if (!document) {
      throw new UserNotFoundException();
    }
    return document;
  }

  async findUserById(id: string): Promise<UserDocument> {
    const document = await this.userModel.findById(id);
    if (!document) {
      throw new UserNotFoundException();
    }
    return document;
  }

  generateJwtForUser(user: UserDocument): string {
    return sign(
      {
        iss: 'dragonzo_user_service',
        sub: user.id,
        aud: 'dragonzo',
        data: {
          username: user.username,
        },
      },
      this.jwtSignPrivateKey,
      {
        expiresIn: Math.floor(this.jwtExpiration / 1000),
      },
    );
  }

  async refreshTokens(refreshToken: string): Promise<ITokens> {
    const refreshTokenDoc = await this.refreshTokenService.validate(
      refreshToken,
    );
    const user = await this.findUserById(refreshTokenDoc.userId);

    if (!user) {
      throw new InvalidRefreshTokenException();
    }

    await this.refreshTokenService.remove(refreshToken);

    const access = this.generateJwtForUser(user);
    const refresh = await this.refreshTokenService.generate(user.id);

    return {
      access,
      refresh,
    };
  }

  async authenticate(username: string, password: string): Promise<ITokens> {
    try {
      const userDocument = await this.findUserByUsername(username);
      await this.cryptoService.validate(userDocument.password, password);

      const access = this.generateJwtForUser(userDocument);
      const refresh = await this.refreshTokenService.generate(userDocument.id);

      return {
        access,
        refresh,
      };
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new InvalidCredentialsException();
      }
      if (error instanceof PasswordsDoNotMatchException) {
        throw new InvalidCredentialsException();
      }
      throw error;
    }
  }

  async createDefaultRootIfNotExist() {
    try {
      await this.createUser(
        this.rootUsername,
        this.rootPassword,
        UserRole.Root,
      );
    } catch (error) {
      if (error instanceof DublicatedUserException) {
        return;
      }
      throw error;
    }
  }
}
