import { AppDataSource } from '@shared/infra/typeorm'

import Post from '@modules/posts/infra/typeorm/entities/Post'

interface Mentions {
  id: string,
  userName: string
}

class GetPostMentionsService {
  public async execute(postId: string): Promise<Mentions[] | undefined> {
    const postsRepository = AppDataSource.getRepository(Post)

    const getPost = await postsRepository.findOne({
      relations: {
        user: { profile: true },
        mentionedUsers: { user: { profile: true } },
      },
      where: { id: postId },
    })

    const mentions = getPost?.mentionedUsers.map((mention) => {
      return {
        id: mention.user.profile.userId,
        userName: mention.user.profile.userName
      }
    })



    return mentions
  }
}

export default GetPostMentionsService
