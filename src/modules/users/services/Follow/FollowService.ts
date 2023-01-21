import { AppDataSource } from '@shared/infra/typeorm'
import Follows from '@modules/users/infra/typeorm/entities/Follows'
import User from '@modules/users/infra/typeorm/entities/User'
import AppError from '@shared/errors/AppError'
import Notification, {
  NotificationType,
} from '@modules/users/infra/typeorm/entities/Notification'
import { socket } from '@shared/infra/http/server'

interface Request {
  loggedUserId: string
  followedUserName: string
}

class FollowService {
  public async execute({
    loggedUserId,
    followedUserName,
  }: Request): Promise<'request' | 'following'> {
    const followsRepository = AppDataSource.getRepository(Follows)
    const userRepository = AppDataSource.getRepository(User)
    const notificationRepository = AppDataSource.getRepository(Notification)

    const followedUser = await userRepository.findOne({
      relations: { profile: true },
      where: { profile: { userName: followedUserName } },
    })

    if (!followedUser) {
      throw new AppError('followedUserNotFound')
    }

    const follow = await followsRepository.save({
      followerUserId: loggedUserId,
      followedUserId: followedUser.id,
      followRequest: followedUser.profile.privateProfile,
    })

    // create notification
    const notification = await notificationRepository.save({
      followId: follow.id,
      fromUserId: loggedUserId,
      toUserId: followedUser.id,
      notificationType: followedUser.profile.privateProfile
        ? NotificationType.FOLLOW_REQUEST
        : NotificationType.NEW_FOLLOW,
    })

    // emit notification to user
    if(socket.sockets.adapter.rooms.get(followedUserName)) {
      socket.to(followedUserName).emit('newNotification', true)
    }

    return followedUser.profile.privateProfile ? 'request' : 'following'
  }
}

export default FollowService
