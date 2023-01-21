import { AppDataSource } from '@shared/infra/typeorm'

import Post from '@modules/posts/infra/typeorm/entities/Post'
import Profile from '@modules/users/infra/typeorm/entities/Profile'
import AppError from '@shared/errors/AppError'

interface Request {
  text?: string
  image?: string
  loggedUserId: string
}

interface PostResponse extends Post {
  author: Profile
}

class CreatePostService {
  public async execute({
    text,
    image,
    loggedUserId,
  }: Request): Promise<PostResponse> {
    const postRepository = AppDataSource.getRepository(Post)
    const profileRepository = AppDataSource.getRepository(Profile)

    const createdPost = await postRepository.save({
      text,
      image,
      userId: loggedUserId,
    })

    const profile = await profileRepository.findOne({
      where: {userId: loggedUserId}
    })

    if(!profile) {
      throw new AppError('profileNotFound')
    }

    const post = {
      ...createdPost,
      author: profile
    }

    return post
  }
}

export default CreatePostService
