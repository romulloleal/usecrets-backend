import { AppDataSource } from '@shared/infra/typeorm'

import User from '@modules/users/infra/typeorm/entities/User'
import AppError from '@shared/errors/AppError'
import Profile from '@modules/users/infra/typeorm/entities/Profile'
import Notification from '@modules/users/infra/typeorm/entities/Notification'

interface AutenticatedUser {
  id: string
  email: string
  profile: Profile
  totalNotificatons: number
}

class GetAuthenticatedUserProfileService {
  public async execute(loggedUserId: string): Promise<AutenticatedUser> {
    const usersRepository = AppDataSource.getRepository(User)
    const notificationssRepository = AppDataSource.getRepository(Notification)

    const user = await usersRepository.findOne({
      relations: { profile: true },
      where: { id: loggedUserId },
    })

    if (!user) {
      throw new AppError('expiredAccessToken')
    }

    const totalNotificatons = await notificationssRepository.count({
      where: { toUserId: loggedUserId, newNotification: true },
    })

    const userProfile: AutenticatedUser = {
      id: user.id,
      email: user.email,
      profile: user.profile,
      totalNotificatons,
    }

    return userProfile
  }
}

export default GetAuthenticatedUserProfileService
