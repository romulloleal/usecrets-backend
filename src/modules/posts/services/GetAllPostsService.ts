import { CheckPostIsLiked } from './CheckPostIsLiked'
import { AppDataSource } from '@shared/infra/typeorm'

import Post from '@modules/posts/infra/typeorm/entities/Post'
import Profile from '@modules/users/infra/typeorm/entities/Profile'
import Follows from '@modules/users/infra/typeorm/entities/Follows'
import { In } from 'typeorm'

interface Request {
  skip: number
  loggedUserId?: string
}

interface Posts extends Post {
  liked?: boolean
  author: Profile
}

interface Response {
  posts: Posts[]
  hasMore: boolean
}

class GetAllPostsService {
  public async execute({ skip, loggedUserId }: Request): Promise<Response> {
    const postsRepository = AppDataSource.getRepository(Post)
    const followsRepository = AppDataSource.getRepository(Follows)

    const usersFollowed = await followsRepository.find({
      where: { followerUserId: loggedUserId, followRequest: false },
    })

    const searchPosts = await postsRepository.findAndCount({
      relations: { user: { profile: true } },
      where: loggedUserId
        ? [
            { user: { profile: { privateProfile: false } } },
            { userId: In(usersFollowed.map(user => user.followedUserId)) },
          ]
        : { user: { profile: { privateProfile: false } } },
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

export default GetAllPostsService
