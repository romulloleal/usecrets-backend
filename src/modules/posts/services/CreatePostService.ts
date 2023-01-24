import { AppDataSource } from '@shared/infra/typeorm'

import Post from '@modules/posts/infra/typeorm/entities/Post'
import Profile from '@modules/users/infra/typeorm/entities/Profile'
import AppError from '@shared/errors/AppError'
import Profanity from 'profanity-js'
import PostMention from '../infra/typeorm/entities/PostMention'
import Notification, {
  NotificationType,
} from '@modules/users/infra/typeorm/entities/Notification'
import { socket } from '@shared/infra/http/server'

interface Request {
  text?: string
  image?: string
  loggedUserId: string
}

interface PostResponse extends Post {
  author: Profile
  mentions: { id: string; userName: string }[] | undefined
}

class CreatePostService {
  public async execute({
    text,
    image,
    loggedUserId,
  }: Request): Promise<PostResponse> {
    const postRepository = AppDataSource.getRepository(Post)
    const profileRepository = AppDataSource.getRepository(Profile)
    const postMentionsRepository = AppDataSource.getRepository(PostMention)
    const notificationRepository = AppDataSource.getRepository(Notification)

    const profile = await profileRepository.findOne({
      where: { userId: loggedUserId },
    })

    if (!profile) {
      throw new AppError('profileNotFound')
    }

    if (!text && !image) {
      throw new AppError('pleasePostTextOrimage')
    }

    const filterPortuguese = new Profanity(text)
    const filterEnglish = new Profanity(filterPortuguese.censor(), {
      language: 'en-us',
    })

    let searchMentions = filterEnglish.censor().match(/\{(.*?)\}/g)
    let newText = filterEnglish.censor()
    let mentions: { id: string; userName: string }[] = []
    if (searchMentions) {
      searchMentions.map(mention => {
        const mentionParsed = JSON.parse(mention)
        mentions.push({
          id: mentionParsed.id,
          userName: mentionParsed.userName,
        })
        newText = newText.replace(
          `"id": "${mentionParsed.id}", "userName": "${mentionParsed.userName}"`,
          mentionParsed.id
        )
      })
    }

    const createdPost = await postRepository.save({
      text: newText,
      image,
      userId: loggedUserId,
    })

    if (searchMentions) {
      // remove duplicates from mention
      const ids = mentions.map(o => o.id)
      const filtered = mentions.filter(({id}, index) => !ids.includes(id, index + 1))

      filtered.map(async mention => {
        await postMentionsRepository.save({
          userId: mention.id,
          postId: createdPost.id,
        })
        await notificationRepository.save({
          postId: createdPost.id,
          fromUserId: loggedUserId,
          toUserId: mention.id,
          type: NotificationType.POST_MENTION,
        })
        if (socket.sockets.adapter.rooms.get(mention.userName)) {
          socket.to(mention.userName).emit('newNotification', true)
        }
      })
    }

    const post = {
      ...createdPost,
      author: profile,
      mentions,
    }

    return post
  }
}

export default CreatePostService
