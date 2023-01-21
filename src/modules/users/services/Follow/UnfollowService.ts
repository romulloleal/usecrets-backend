import { AppDataSource } from '@shared/infra/typeorm'
import Follows from '@modules/users/infra/typeorm/entities/Follows'
import User from '@modules/users/infra/typeorm/entities/User'

interface Request {
  loggedUserId: string
  followedUserName: string
}

class UnfollowService {
  public async execute({
    loggedUserId,
    followedUserName,
  }: Request): Promise<void> {
    const followsRepository = AppDataSource.getRepository(Follows)
    const userRepository = AppDataSource.getRepository(User)

    const followedUser = await userRepository.findOne({
      relations: { profile: true },
      where: { profile: { userName: followedUserName } },
    })

    if (followedUser)
      await followsRepository.delete({
        followerUserId: loggedUserId,
        followedUserId: followedUser.id,
      })
  }
}

export default UnfollowService
