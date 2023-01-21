import { AppDataSource } from '@shared/infra/typeorm'

import Follows from '@modules/users/infra/typeorm/entities/Follows'
import Notification, {
  NotificationType,
} from '@modules/users/infra/typeorm/entities/Notification'
import { socket } from '@shared/infra/http/server'


interface Request {
  loggedUserId: string
  followRequestId: string
  action: 'accept' | 'reject'
}

class AcceptRejectFollowerRequestService {
  public async execute({
    loggedUserId,
    followRequestId,
    action,
  }: Request): Promise<void> {
    const followsRepository = AppDataSource.getRepository(Follows)
    const notificationRepository = AppDataSource.getRepository(Notification)

    const followRequest = await followsRepository.findOne({
      relations: { followerUser: { profile: true } },
      where: { id: followRequestId, followedUserId: loggedUserId },
    })

    if (followRequest && action === 'accept') {
      await followsRepository.update(
        { id: followRequest.id },
        {
          followRequest: false,
        }
      )

      // edit followNotification
      await notificationRepository.update(
        { followId: followRequest.id },
        { notificationType: NotificationType.NEW_FOLLOW }
      )

      // create notification
      await notificationRepository.save({
        followId: followRequest.id,
        fromUserId: loggedUserId,
        toUserId: followRequest.followerUserId,
        notificationType: NotificationType.FOLLOW_ACCEPTED,
      })

      // emit notification to user
      if(socket.sockets.adapter.rooms.get(followRequest.followerUser.profile.userName)) {
        socket.to(followRequest.followerUser.profile.userName).emit('newNotification', true)
      }
    }
    if (followRequest && action === 'reject') {
      await followsRepository.delete({ id: followRequest.id })
    }
  }
}

export default AcceptRejectFollowerRequestService
