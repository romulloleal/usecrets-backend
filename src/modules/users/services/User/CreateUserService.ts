import { hash } from 'bcryptjs'
import { AppDataSource } from '@shared/infra/typeorm'

import User from '@modules/users/infra/typeorm/entities/User'
import AppError from '@shared/errors/AppError'
import CheckValidUserNameService from './CheckValidUserNameService'
import PasswordCheckService from './PasswordCheckService'
import CheckValidEmailService from './CheckValidEmailService'
import Profile from '@modules/users/infra/typeorm/entities/Profile'

interface Request {
  userName: string
  email: string
  password: string
}

class CreateUserService {
  public async execute({
    userName,
    email,
    password,
  }: Request): Promise<void> {
    const usersRepository = AppDataSource.getRepository(User)
    const profileRepository = AppDataSource.getRepository(Profile)
    userName = userName.toLowerCase()
    email = email.toLowerCase()

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

    const checkValidEmail = new CheckValidEmailService()
    if (!(await checkValidEmail.execute(email))) {
      throw new AppError('invalidEmail')
    }

    const checkEmailExists = await usersRepository.findOne({
      where: { email },
    })
    if (checkEmailExists) {
      throw new AppError('emailAlreadyInUse')
    }

    const checkUserNameExists = await usersRepository.findOne({
      relations: { profile: true },
      where: { profile: { userName } },
    })
    if (checkUserNameExists) {
      throw new AppError('userNameAlreadyInUse')
    }

    if (password.length <= 5) {
      throw new AppError('passwordNeedsAtLeast6Characters')
    }
    const testBlankSpace = new RegExp('\\s+')
    if (testBlankSpace.test(password)) {
      throw new AppError('passwordCantHaveBlankSpace')
    }
    const passwordCheck = new PasswordCheckService()
    if (!(await passwordCheck.execute(password))) {
      throw new AppError('passwordNeedsAtLeas1tLetter1NumbersAnd1SpecialChar')
    }

    const hashedPassword = await hash(password, 8)


    const user = await usersRepository.save({
      email,
      password: hashedPassword
    })

    await profileRepository.save({ user, userName })
  }
}

export default CreateUserService
