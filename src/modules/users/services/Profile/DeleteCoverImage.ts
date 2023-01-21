import uploadConfig from '@config/upload'
import { AppDataSource } from '@shared/infra/typeorm'

import User from '@modules/users/infra/typeorm/entities/User'
import Profile from '@modules/users/infra/typeorm/entities/Profile'

interface Request {
  userId: string
}

class DeleteCoverImage {
  public async execute({ userId }: Request): Promise<void> {
    const userRepository = AppDataSource.getRepository(User)
    const profileRepository = AppDataSource.getRepository(Profile)

    const user = await userRepository.findOne({
      relations: { profile: true },
      where: { id: userId },
    })

    if (user?.profile.coverImage) {
      await uploadConfig.deleteImage({
        folder: 'cover',
        imageName: user.profile.coverImage,
      })
    }

    await profileRepository.save({ ...user?.profile, coverImage: null })
  }
}

export default DeleteCoverImage
