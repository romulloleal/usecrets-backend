import { AppDataSource } from '@shared/infra/typeorm'
import Follows from '@modules/users/infra/typeorm/entities/Follows'
import User from '@modules/users/infra/typeorm/entities/User'
import Profile from '@modules/users/infra/typeorm/entities/Profile'
import Post from '@modules/posts/infra/typeorm/entities/Post'
import GetProfilePostsService from '@modules/posts/services/GetProfilePostsService'

interface Request {
  loggedUserId?: string
  userName: string
}

interface InitialPosts extends Post {
  liked: boolean
  author: Profile
}

interface Response {
  profile: Profile | undefined
  totalFollowing: number
  totalFollowers: number
  totalPosts: number
  followStatus: string // following | request | notFollowing | userProfile
  initialPosts: {
    posts: InitialPosts[]
    hasMore: boolean
  }
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
        initialPosts: {
          posts: [],
          hasMore: false
        }
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

    const getProfilePosts = new GetProfilePostsService()

    const initialPosts = await getProfilePosts.execute({skip: 0, userName, loggedUserId})

    return {
      profile: user.profile,
      totalFollowing,
      totalFollowers,
      totalPosts,
      followStatus,
      initialPosts
    }
  }
}

export default GetUserProfileService
