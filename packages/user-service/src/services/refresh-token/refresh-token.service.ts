import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectValue } from '@sonyahon/config';
import { Model } from 'mongoose';
import { nanoid } from 'nanoid';
import { AppConfig } from '../../config/app.config';
import {
  MongooseRefreshToken,
  RefreshTokenDocument,
} from '../../schemas/refresh-token.schema';
import { InvalidRefreshTokenException } from './refresh-token.exceptions';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectModel(MongooseRefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshTokenDocument>,
    @InjectValue(AppConfig, 'refreshTokenLifetime')
    private readonly tokenLifetime: number,
  ) {}

  async generate(userId: string): Promise<string> {
    const document = new this.refreshTokenModel({
      token: nanoid(),
      createdAt: Date.now(),
      userId,
    });
    await document.save();
    return document.token;
  }

  private validateTime(doc: RefreshTokenDocument) {
    const { createdAt } = doc;
    if (createdAt + this.tokenLifetime <= Date.now()) {
      throw new InvalidRefreshTokenException();
    }
  }

  private validateToken(doc: RefreshTokenDocument) {
    const res = doc && doc.token;
    if (!res) {
      throw new InvalidRefreshTokenException();
    }
  }

  async validate(token: string): Promise<RefreshTokenDocument> {
    const tokenDocument = await this.refreshTokenModel.findOne({
      token,
    });
    this.validateToken(tokenDocument);
    this.validateTime(tokenDocument);
    return tokenDocument;
  }

  async remove(token: string): Promise<void> {
    await this.refreshTokenModel.findOneAndRemove({
      token,
    });
  }
}
