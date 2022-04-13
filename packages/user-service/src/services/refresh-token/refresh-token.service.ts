import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { nanoid } from 'nanoid';
import {
  MongooseRefreshToken,
  RefreshTokenDocument,
} from '../../schemas/refresh-token.schema';
import { InvalidRefreshTokenException } from './refresh-token.exceptions';

@Injectable()
export class RefreshTokenService {
  private readonly tokenLifetime: number;

  constructor(
    @InjectModel(MongooseRefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshTokenDocument>,
    tokenLifetime?: number,
  ) {
    this.tokenLifetime =
      tokenLifetime || parseInt(process.env.REFRESH_TOKEN_LIFETIME);
  }

  async generate(userId: string): Promise<string> {
    const document = new this.refreshTokenModel({
      token: nanoid(),
      createdAt: Date.now(),
      userId,
    });
    await document.save();
    return document.token;
  }

  async validate(token: string): Promise<RefreshTokenDocument> {
    const tokenDocument = await this.refreshTokenModel.findOne({
      token,
    });
    if (!tokenDocument) {
      throw new InvalidRefreshTokenException();
    }
    const { createdAt } = tokenDocument;
    if (createdAt + this.tokenLifetime <= Date.now()) {
      throw new InvalidRefreshTokenException();
    }
    return tokenDocument;
  }

  async remove(token: string): Promise<void> {
    await this.refreshTokenModel.findOneAndRemove({
      token,
    });
  }
}
