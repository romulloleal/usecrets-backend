import { FormatPost } from './FormatPost'
import { AppDataSource } from '@shared/infra/typeorm'

import Post from '@modules/posts/infra/typeorm/entities/Post'
import Profile from '@modules/users/infra/typeorm/entities/Profile'
import Follows from '@modules/users/infra/typeorm/entities/Follows'
import { In } from 'typeorm'
import PostLike from '../infra/typeorm/entities/PostLike'
import GetPostMentionsService from './GetPostMentionsService'

interface Request {
  postId: string
  loggedUserId?: string
}

interface IPost extends Post {
  liked?: boolean
  author: Profile
  mentions: { id: string; userName: string }[] | undefined
}

interface PostResponse {
  post: IPost | undefined
  postNotFound: boolean
  privatePost: boolean
}

class GetPostService {
  public async execute({ postId, loggedUserId }: Request): Promise<PostResponse> {
    const postsRepository = AppDataSource.getRepository(Post)
    const followsRepository = AppDataSource.getRepository(Follows)
    const postLikesRepository = AppDataSource.getRepository(PostLike)

    // validate uuid before search
    const regexUUID = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

    const validUUID = regexUUID.test(postId)

    if (!validUUID) {
      return { post: undefined, postNotFound: true, privatePost: false }
    }

    const getPost = await postsRepository.findOne({
      relations: { user: { profile: true } },
      where: { id: postId },
    })

    if (!getPost) {
      return { post: undefined, postNotFound: true, privatePost: false }
    }

    const checkIsFollowing = await followsRepository.findOne({
      where: {
        followerUserId: loggedUserId,
        followedUserId: getPost.userId,
      },
    })

    if (!checkIsFollowing && getPost.user.profile.privateProfile) {
      return { post: undefined, postNotFound: false, privatePost: true }
    }

    const liked = await postLikesRepository.findOne({
      where: { userId: loggedUserId, postId: getPost.id },
    })

    const getMentions = new GetPostMentionsService()
    const mentions = await getMentions.execute(getPost.id)

    const profile = getPost.user.profile
    delete (getPost as any).user
    return {
      post: {
        ...getPost,
        author: profile,
        liked: loggedUserId && liked ? true : false,
        mentions,
      },
      postNotFound: false,
      privatePost: false,
    }
  }
}

export default GetPostService
