import { AppDataSource } from '@shared/infra/typeorm'

import User from '@modules/users/infra/typeorm/entities/User'
import Profile from '@modules/users/infra/typeorm/entities/Profile'
import { compare, hash } from 'bcryptjs'
import AppError from '@shared/errors/AppError'
import CheckValidUserNameService from '../User/CheckValidUserNameService'
import PasswordCheckService from '../User/PasswordCheckService'
import { Not } from 'typeorm'

interface Request {
  userId: string
  userName: string
  privateProfile: boolean
  currentPassword?: string
  newPassword?: string
}

interface AutenticatedUser {
  id: string
  email: string
  profile: Profile
}

class EditProfileService {
  public async execute({
    userId,
    userName,
    privateProfile,
    currentPassword,
    newPassword,
  }: Request): Promise<AutenticatedUser> {
    const userRepository = AppDataSource.getRepository(User)
    const profileRepository = AppDataSource.getRepository(Profile)

    userName = userName.toLowerCase()

    const checkValidUserName = new CheckValidUserNameService()
    if (userName.length <= 4) {
      throw new AppError('userNameTooLongOrSmall')
    }

    if (userName.length >= 21) {
      throw new AppError('userNameTooLongOrSmall')
    }

    if (!(await checkValidUserName.execute(userName))) {
      throw new AppError('userNameCanOnlyContainLettersNumbers')
    }

    const checkUserNameExists = await userRepository.findOne({
      relations: { profile: true },
      where: { id: Not(userId), profile: { userName } },
    })
    if (checkUserNameExists) {
      throw new AppError('userNameAlreadyInUse')
    }

    const user = await userRepository.findOne({
      relations: { profile: true },
      where: { id: userId },
    })

    if(!user) {
      throw new AppError('userNotFound')
    }

    if(currentPassword && newPassword) {
      if (newPassword.length <= 5) {
        throw new AppError('passwordNeedsAtLeast6Characters')
      }
      const testBlankSpace = new RegExp('\\s+')
      if (testBlankSpace.test(newPassword)) {
        throw new AppError('passwordCantHaveBlankSpace')
      }
      const passwordCheck = new PasswordCheckService()
      if (!(await passwordCheck.execute(newPassword))) {
        throw new AppError('passwordNeedsAtLeas1tLetter1NumbersAnd1SpecialChar')
      }

      const passwordMatch = await compare(currentPassword, user.password)

      if (!passwordMatch) {
        throw new AppError('incorrectCurrentPassword', 400)
      }

      const hashedPassword = await hash(newPassword, 8)

      await userRepository.save({...user, password: hashedPassword})
    }

    const newProfile = {
      ...user.profile,
      userName,
      privateProfile
    }

    const profile = await profileRepository.save(newProfile)

    const userProfile: AutenticatedUser = {
      id: user.id,
      email: user.email,
      profile: profile
    }

    return userProfile
  }
}

export default EditProfileService
