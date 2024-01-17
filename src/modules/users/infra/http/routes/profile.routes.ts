import uploadConfig from '@config/upload'
import { Router } from 'express'

import ensureAuthenticated from '@middlewares/ensureAuthenticated'
import EditProfileService from '@modules/users/services/Profile/EditProfileService'
import GetUserProfileService from '@modules/users/services/Profile/GetUserProfileService'
import ChangeCoverImageService from '@modules/users/services/Profile/ChangeCoverImageService'
import SearchProfilesService from '@modules/users/services/Profile/SearchProfilesService'
import ChangeProfileImageService from '@modules/users/services/Profile/ChangeProfileImageService'
import DeleteCoverImage from '@modules/users/services/Profile/DeleteCoverImage'
import DeleteProfileImage from '@modules/users/services/Profile/DeleteProfileImage'
import GetNotificationsService from '@modules/users/services/Notification/GetNotificationsService'
import MarkNotificationAsRead from '@modules/users/services/Notification/MarkNotificationAsRead'

const profileRouter = Router()

profileRouter.post(
  '/editProfile',
  ensureAuthenticated,
  async (request, response) => {
    const { userName, privateProfile, currentPassword, newPassword } =
      request.body

    const userId = request.user.id

    const editProfile = new EditProfileService()

    const profile = await editProfile.execute({
      userId,
      userName,
      privateProfile,
      currentPassword,
      newPassword,
    })

    return response.json({
      status: 'success',
      message: 'profileUpdated',
      data: profile,
    })
  }
)

profileRouter.post('/getUserProfile', async (request, response) => {
  const { loggedUserId, userName } = request.body

  const userProfile = new GetUserProfileService()

  const profile = await userProfile.execute({ userName, loggedUserId })

  return response.json({
    status: 'success',
    data: profile,
  })
})

profileRouter.post('/searchProfiles', async (request, response) => {
  const { search } = request.body

  const searchProfiles = new SearchProfilesService()

  const profiles = await searchProfiles.execute({ search })

  return response.json({
    status: 'success',
    data: profiles,
  })
})

profileRouter.post(
  '/updateCoverImage',
  uploadConfig.storage,
  ensureAuthenticated,
  async (request, response) => {
    const userId = request.user.id

    let coverImage = undefined

    if (request.file) {
      coverImage = await uploadConfig.uploadImage({
        file: request.file,
        folder: 'cover',
      })
    }

    const changerCoverImage = new ChangeCoverImageService()

    await changerCoverImage.execute({ userId, coverImage })

    return response.json({
      status: 'success',
      data: { coverImage },
    })
  }
)

profileRouter.post(
  '/updateProfileImage',
  uploadConfig.storage,
  ensureAuthenticated,
  async (request, response) => {
    const userId = request.user.id

    let profileImage = undefined

    if (request.file) {
      profileImage = await uploadConfig.uploadImage({
        file: request.file,
        folder: 'profile',
      })
    }

    const changeProfileImage = new ChangeProfileImageService()

    await changeProfileImage.execute({ userId, profileImage })

    return response.json({
      status: 'success',
      data: { profileImage },
    })
  }
)

profileRouter.post(
  '/deleteProfileImage',
  ensureAuthenticated,
  async (request, response) => {
    const userId = request.user.id

    const deleteImage = new DeleteProfileImage()

    await deleteImage.execute({ userId })

    return response.json({
      status: 'success',
    })
  }
)

profileRouter.post(
  '/deleteCoverImage',
  ensureAuthenticated,
  async (request, response) => {
    const userId = request.user.id

    const deleteImage = new DeleteCoverImage()

    await deleteImage.execute({ userId })

    return response.json({
      status: 'success',
    })
  }
)

profileRouter.post(
  '/getNotifications',
  ensureAuthenticated,
  async (request, response) => {
    const { skip } = request.body

    const loggedUserId = request.user.id

    const getNotifications = new GetNotificationsService()

    const notifications = await getNotifications.execute({ skip, loggedUserId })

    return response.json({
      status: 'success',
      data: notifications,
    })
  }
)

profileRouter.post(
  '/markNotificationAsRead',
  ensureAuthenticated,
  async (request, response) => {
    const { notificationId, markAll } = request.body

    const loggedUserId = request.user.id

    const markNotificationAsRead = new MarkNotificationAsRead()

    await markNotificationAsRead.execute({
      notificationId,
      loggedUserId,
      markAll,
    })

    return response.json({
      status: 'success',
    })
  }
)

export default profileRouter
