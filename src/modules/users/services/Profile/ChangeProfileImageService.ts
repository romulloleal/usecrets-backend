import uploadConfig from '@config/upload';
import { AppDataSource } from '@shared/infra/typeorm'

import User from '@modules/users/infra/typeorm/entities/User'
import Profile from '@modules/users/infra/typeorm/entities/Profile'

interface Request {
  userId: string
  profileImage: string
}

class ChangeProfileImageService {
  public async execute({ userId, profileImage }: Request): Promise<void> {
    const userRepository = AppDataSource.getRepository(User)
    const profileRepository = AppDataSource.getRepository(Profile)

    const user = await userRepository.findOne({
      relations: { profile: true },
      where: { id: userId },
    })

    if (user?.profile.profileImage) {
      await uploadConfig.deleteImage({
        folder: 'profile',
        imageName: user.profile.profileImage,
      })
    }

    await profileRepository.save({ ...user?.profile, profileImage })
  }
}

export default ChangeProfileImageService
