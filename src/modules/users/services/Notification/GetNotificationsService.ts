import Notification from '@modules/users/infra/typeorm/entities/Notification'
import Profile from '@modules/users/infra/typeorm/entities/Profile'
import { AppDataSource } from '@shared/infra/typeorm'

interface Request {
  skip: number
  loggedUserId: string
}

interface Response {
  notifications: {
    id: string
    fromUser: Profile
    notificationType: string
    newNotification: boolean
    followId: string
    likeId: string
  }[]
  hasMore: boolean
}

class GetNotificationsService {
  public async execute({ skip, loggedUserId }: Request): Promise<Response> {
    const notificationsRepository = AppDataSource.getRepository(Notification)

    const searchNotifications = await notificationsRepository.findAndCount({
      relations: { fromUser: { profile: true } },
      where: { toUserId: loggedUserId },
      skip,
      take: 20,
      order: { updatedAt: 'DESC' },
    })

    const hasMore =
      skip + searchNotifications[0].length < searchNotifications[1]

    const notifications = searchNotifications[0].map(notification => {
      const fromUser = notification.fromUser.profile
      return {
        id: notification.id,
        fromUser,
        notificationType: notification.notificationType,
        newNotification: notification.newNotification,
        followId: notification.followId,
        likeId: notification.likeId,
      }
    })

    return { notifications, hasMore }
  }
}

export default GetNotificationsService
