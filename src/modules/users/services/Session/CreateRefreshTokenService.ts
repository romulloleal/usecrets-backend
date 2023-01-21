import { sign } from 'jsonwebtoken';

import authConfigRefresh from '@config/refreshToken';

class CreateRefreshTokenService {
  public async execute(userId: string): Promise<string> {
    const { secret, expiresIn } = authConfigRefresh.jwt;

    const refreshToken = sign({}, secret, {
      subject: userId,
      expiresIn,
    });

    return refreshToken;
  }
}

export default CreateRefreshTokenService;
