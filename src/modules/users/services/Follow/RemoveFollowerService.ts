import { AppDataSource } from '@shared/infra/typeorm'
import Follows from '@modules/users/infra/typeorm/entities/Follows'
import User from '@modules/users/infra/typeorm/entities/User'

interface Request {
  loggedUserId: string
  followerUserName: string
}

class RemoveFollowerService {
  public async execute({
    loggedUserId,
    followerUserName,
  }: Request): Promise<void> {
    const followsRepository = AppDataSource.getRepository(Follows)
    const userRepository = AppDataSource.getRepository(User)

    const followerUser = await userRepository.findOne({
      relations: { profile: true },
      where: { profile: { userName: followerUserName } },
    })

    if (followerUser)
      await followsRepository.delete({
        followerUserId: followerUser.id,
        followedUserId: loggedUserId,
      })
  }
}

export default RemoveFollowerService
