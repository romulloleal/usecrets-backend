import { AppDataSource } from '@shared/infra/typeorm'

import Notification from '@modules/users/infra/typeorm/entities/Notification'

interface Request {
  loggedUserId: string
  notificationId?: string
  markAll?: boolean
}

class MarkNotificationAsRead {
  public async execute({
    loggedUserId,
    notificationId,
    markAll,
  }: Request): Promise<void> {
    const notificationRepository = AppDataSource.getRepository(Notification)

    if (markAll) {
      await notificationRepository.update(
        { toUserId: loggedUserId },
        { newNotification: false }
      )
    } else {
      await notificationRepository.update(
        { id: notificationId, toUserId: loggedUserId },
        { newNotification: false }
      )
    }
  }
}

export default MarkNotificationAsRead
