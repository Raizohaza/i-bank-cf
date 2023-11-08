import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Query } from 'mongoose';
import { IToken } from '../interfaces/token.interface';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel('Token') private readonly tokenModel: Model<IToken>,
  ) {}

  public createToken(uid: string): Promise<IToken> {
    const token = this.jwtService.sign(
      {
        uid: uid,
      },
      {
        expiresIn: 30 * 24 * 60 * 60,
      },
    );

    return new this.tokenModel({
      uid: uid,
      token,
    }).save();
  }

  public async deleteTokenForUid(
    uid: string,
  ): Promise<Query<unknown, unknown>> {
    return await this.tokenModel.remove({
      uid: uid,
    });
  }

  public async decodeToken(token: string) {
    const tokenModel = await this.tokenModel.find({
      token,
    });
    let result = null;

    if (tokenModel && tokenModel[0]) {
      try {
        const tokenData = (await this.jwtService.decode(
          tokenModel[0].token,
        )) as {
          exp: number;
          uid: unknown;
        };
        if (!tokenData || tokenData.exp <= Math.floor(+new Date() / 1000)) {
          result = null;
        } else {
          result = {
            uid: tokenData.uid,
          };
        }
      } catch (e) {
        result = null;
      }
    }
    return result;
  }
}
