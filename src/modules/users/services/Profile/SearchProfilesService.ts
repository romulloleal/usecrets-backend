import { AppDataSource } from '@shared/infra/typeorm'

import Profile from '@modules/users/infra/typeorm/entities/Profile'
import { Like } from 'typeorm'

interface Request {
  search: string
}

class SearchProfilesService {
  public async execute({ search }: Request): Promise<Profile[]> {
    const profileRepository = AppDataSource.getRepository(Profile)

    search = search.toLowerCase()

    const profiles = await profileRepository.find({
      where: { userName: Like(`%${search}%`) },
      take: 20,
    })

    return profiles
  }
}

export default SearchProfilesService
