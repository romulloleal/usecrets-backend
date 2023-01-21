import { sign } from 'jsonwebtoken';

import authConfig from '@config/auth';

class CreateAccessTokenService {
  public async execute(userId: string): Promise<string> {
    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: userId,
      expiresIn,
    });

    return token;
  }
}

export default CreateAccessTokenService;
