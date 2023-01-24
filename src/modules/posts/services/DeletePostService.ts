import uploadConfig from '@config/upload';
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

class DeletePostService {
  public async execute({ postId, loggedUserId }: Request): Promise<void> {
    const postRepository = AppDataSource.getRepository(Post)

    const post = await postRepository.findOne({
      where: { id: postId, userId: loggedUserId },
    })

    if (post?.image) {
      await uploadConfig.deleteImage({
        folder: 'post',
        imageName: post.image,
      })
    }

    await postRepository.delete({ id: post?.id, userId: post?.userId })
  }
}

export default DeletePostService
