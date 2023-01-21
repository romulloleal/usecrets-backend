import { AppDataSource } from '@shared/infra/typeorm'

import Post from '@modules/posts/infra/typeorm/entities/Post'
import Follows from '@modules/users/infra/typeorm/entities/Follows'
import User from '@modules/users/infra/typeorm/entities/User'
import Profile from '@modules/users/infra/typeorm/entities/Profile'
import { CheckPostIsLiked } from './CheckPostIsLiked'

interface Request {
  skip: number
  loggedUserId?: string
  userName: string
}

interface Posts extends Post {
  liked: boolean
  author: Profile
}

interface Response {
  posts: Posts[]
  hasMore: boolean
}

class GetProfilePostsService {
  public async execute({
    skip,
    loggedUserId,
    userName,
  }: Request): Promise<Response> {
    const postsRepository = AppDataSource.getRepository(Post)
    const usersRepository = AppDataSource.getRepository(User)
    const followsRepository = AppDataSource.getRepository(Follows)

    const userProfile = await usersRepository.findOne({
      relations: { profile: true },
      where: { profile: { userName } },
    })

    if (!userProfile) {
      return { posts: [], hasMore: false, }
    }

    const checkIsFollowing = await followsRepository.findOne({
      where: {
        followerUserId: loggedUserId,
        followedUserId: userProfile.id,
        followRequest: false,
      },
    })

    if (
      userProfile.profile.privateProfile && // check profile is private
      !checkIsFollowing && // check is following this user
      loggedUserId !== userProfile.id // check if is the same user
    ) {
      return { posts: [], hasMore: false, }
    }

    const searchPosts = await postsRepository.findAndCount({
      relations: { user: { profile: true } },
      where: { user: { profile: { userName } } },
      skip: skip,
      take: 20,
      order: { createdAt: 'DESC' },
    })

    // check user liked post or not
    const posts = await CheckPostIsLiked({
      posts: searchPosts[0],
      loggedUserId,
    })

    // for pagination purpose
    const hasMore = skip + searchPosts[0].length < searchPosts[1]

    return { posts, hasMore }
  }
}

export default GetProfilePostsService
