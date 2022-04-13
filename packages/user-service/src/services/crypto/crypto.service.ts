import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { PasswordsDoNotMatchException } from './crypto.service.exceptions';

@Injectable()
export class CryptoService {
  private static SaltRounds = 13;

  async hash(rawPassword: string): Promise<string> {
    return await hash(rawPassword, CryptoService.SaltRounds);
  }

  async validate(hash: string, rawPassword: string): Promise<boolean> {
    const res = await compare(rawPassword, hash);
    if (res) {
      return true;
    }
    throw new PasswordsDoNotMatchException();
  }
}
