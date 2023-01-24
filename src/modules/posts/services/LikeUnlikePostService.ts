import { AppDataSource } from '@shared/infra/typeorm'

import Post from '@modules/posts/infra/typeorm/entities/Post'
import PostLike from '../infra/typeorm/entities/PostLike'
import Notification, {
  NotificationType,
} from '@modules/users/infra/typeorm/entities/Notification'
import { socket } from '@shared/infra/http/server'

interface Request {
  postId: string
  loggedUserId: string
}

class LikeUnlikePostService {
  public async execute({ postId, loggedUserId }: Request): Promise<void> {
    const postRepository = AppDataSource.getRepository(Post)
    const postLikeRepository = AppDataSource.getRepository(PostLike)
    const notificationRepository = AppDataSource.getRepository(Notification)

    const post = await postRepository.findOne({
      relations: { postLikes: true, user: { profile: true } },
      where: { id: postId },
    })

    const checkIsLiked = post?.postLikes.find(like =>
      like.userId === loggedUserId ? true : false
    )

    if (!checkIsLiked && post) {
      await postRepository.save({ ...post, totalLikes: ++post.totalLikes })
      const like = await postLikeRepository.save({
        userId: loggedUserId,
        post,
        postId: postId,
      })

      // create notification
      if (loggedUserId !== post.user.id) {
        await notificationRepository.save({
          likeId: like.id,
          fromUserId: loggedUserId,
          toUserId: post.user.id,
          type: NotificationType.POST_LIKED,
          postId: postId
        })

        // emit notification to user
        if(socket.sockets.adapter.rooms.get(post.user.profile.userName)) {
          socket.to(post.user.profile.userName).emit('newNotification', true)
        }
      }
    }

    if (checkIsLiked && post) {
      await postRepository.save({ ...post, totalLikes: --post.totalLikes })
      await postLikeRepository.delete({ postId, userId: loggedUserId })
    }
  }
}

export default LikeUnlikePostService
