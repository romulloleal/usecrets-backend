import { AppDataSource } from '@shared/infra/typeorm'
import Follows from '@modules/users/infra/typeorm/entities/Follows'
import User from '@modules/users/infra/typeorm/entities/User'
import Profile from '@modules/users/infra/typeorm/entities/Profile'
import Post from '@modules/posts/infra/typeorm/entities/Post'

interface Request {
  loggedUserId?: string
  userName: string
}

interface Response {
  profile: Profile | undefined
  totalFollowing: number
  totalFollowers: number
  totalPosts: number
  followStatus: string // following | request | notFollowing | userProfile
}

class GetUserProfileService {
  public async execute({ loggedUserId, userName }: Request): Promise<Response> {
    const userRepository = AppDataSource.getRepository(User)
    const followsRepository = AppDataSource.getRepository(Follows)
    const postsRepository = AppDataSource.getRepository(Post)

    let followStatus = 'notFollowing'

    const user = await userRepository.findOne({
      relations: { profile: true },
      where: { profile: { userName } },
    })

    if (!user) {
      return {
        profile: undefined,
        totalFollowing: 0,
        totalFollowers: 0,
        totalPosts: 0,
        followStatus,
      }
    }

    const checkIsFollowing = await followsRepository.findOne({
      where: {
        followerUserId: loggedUserId,
        followedUserId: user.id,
      },
    })

    const totalFollowing = await followsRepository.count({
      where: { followerUserId: user.id, followRequest: false },
    })

    const totalFollowers = await followsRepository.count({
      where: { followedUserId: user.id, followRequest: false },
    })

    const totalPosts = await postsRepository.count({
      where: { userId: user.id },
    })

    if (loggedUserId && checkIsFollowing && !checkIsFollowing.followRequest) {
      followStatus = 'following'
    }

    if (loggedUserId && checkIsFollowing && checkIsFollowing.followRequest) {
      followStatus = 'request'
    }

    if(loggedUserId === user.id) {
      followStatus = 'userProfile'
    }

    return {
      profile: user.profile,
      totalFollowing,
      totalFollowers,
      totalPosts,
      followStatus,
    }
  }
}

export default GetUserProfileService
