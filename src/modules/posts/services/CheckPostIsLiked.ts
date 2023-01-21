import { AppDataSource } from '@shared/infra/typeorm'
import Post from '../infra/typeorm/entities/Post'
import PostLike from '../infra/typeorm/entities/PostLike'

export const CheckPostIsLiked = async ({
  posts,
  loggedUserId,
}: {
  posts: Post[]
  loggedUserId?: string
}) => {
  const postLikesRepository = AppDataSource.getRepository(PostLike)

  const result = posts.map(async post => {
    const liked = await postLikesRepository.findOne({
      where: { userId: loggedUserId, postId: post.id },
    })
    const profile = post.user.profile
    delete (post as any).user
    return {
      ...post,
      author: profile,
      liked: loggedUserId && liked ? true : false,
    }
  })

  return await Promise.all(result)
}
