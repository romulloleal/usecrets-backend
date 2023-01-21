import { AppDataSource } from '@shared/infra/typeorm'
import { compare } from 'bcryptjs'

import AppError from '@shared/errors/AppError'

import User from '@modules/users/infra/typeorm/entities/User'
import CreateRefreshTokenService from './CreateRefreshTokenService'
import CreateAccessTokenService from './CreateAccessTokenService'
import Profile from '@modules/users/infra/typeorm/entities/Profile'
import GetAuthenticatedUserProfileService from './GetAuthenticatedUserProfileService'

interface Request {
  login: string
  password: string
}

interface AutenticatedUser {
  id: string
  email: string
  profile: Profile
  totalNotificatons: number
}

interface Response {
  user: AutenticatedUser
  accessToken: string
  refreshToken: string
}

class AuthenticateUserService {
  public async execute({ login, password }: Request): Promise<Response> {
    const usersRepository = AppDataSource.getRepository(User)
    login = login.toLowerCase()

    const user = await usersRepository.findOne({
      relations: { profile: true },
      where: [{ email: login }, { profile: { userName: login } }],
    })

    if (!user) {
      throw new AppError('incorrectEmailOrPassword', 400)
    }

    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      throw new AppError('incorrectEmailOrPassword', 400)
    }

    const createAccessTokenService = new CreateAccessTokenService()
    const accessToken = await createAccessTokenService.execute(user.id)

    const createRefreshTokenService = new CreateRefreshTokenService()
    const refreshToken = await createRefreshTokenService.execute(user.id)

    const getAuthenticatedUserProfile = new GetAuthenticatedUserProfileService()
    const userProfile = await getAuthenticatedUserProfile.execute(user.id)

    return {
      user: userProfile,
      accessToken,
      refreshToken,
    }
  }
}

export default AuthenticateUserService
