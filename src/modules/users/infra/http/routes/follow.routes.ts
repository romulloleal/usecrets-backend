import { Router } from 'express'

import ensureAuthenticated from '@middlewares/ensureAuthenticated'

import AcceptRejectFollowerRequestService from '@modules/users/services/Follow/AcceptRejectFollowerRequestService'
import UnfollowService from '@modules/users/services/Follow/UnfollowService'
import FollowService from '@modules/users/services/Follow/FollowService'
import RemoveFollowerService from '@modules/users/services/Follow/RemoveFollowerService'

const followRouter = Router()

// logged user follows or send a follow request
followRouter.post(
  '/followUser',
  ensureAuthenticated,
  async (request, response) => {
    const { followedUserName } = request.body

    const loggedUserId = request.user.id

    const follow = new FollowService()

    const status = await follow.execute({
      loggedUserId,
      followedUserName,
    })

    return response.json({
      status: 'success',
      data: { status },
    })
  }
)

// logged user stops following an user
followRouter.post(
  '/unfollowUser',
  ensureAuthenticated,
  async (request, response) => {
    const { followedUserName } = request.body

    const loggedUserId = request.user.id

    const unfollowUser = new UnfollowService()

    await unfollowUser.execute({ loggedUserId, followedUserName })

    return response.json({
      status: 'success',
    })
  }
)

// logged user accepts/reject follower request
followRouter.post(
  '/acceptRejectFollowerRequest',
  ensureAuthenticated,
  async (request, response) => {
    const { followRequestId, action } = request.body

    const loggedUserId = request.user.id

    const acceptFollow = new AcceptRejectFollowerRequestService()

    await acceptFollow.execute({
      followRequestId,
      loggedUserId,
      action,
    })

    return response.json({
      status: 'success',
    })
  }
)

// logged user cancel follow request
followRouter.post(
  '/cancelFollowRequest',
  ensureAuthenticated,
  async (request, response) => {
    const { followedUserName } = request.body

    const loggedUserId = request.user.id

    const cancelFollowRequest = new UnfollowService()

    await cancelFollowRequest.execute({ loggedUserId, followedUserName })

    return response.json({
      status: 'success',
    })
  }
)

// logged user remove a follower
followRouter.post(
  '/removeFollower',
  ensureAuthenticated,
  async (request, response) => {
    const { followerUserName } = request.body

    const loggedUserId = request.user.id

    const removeFollower = new RemoveFollowerService()

    await removeFollower.execute({ loggedUserId, followerUserName })

    return response.json({
      status: 'success',
    })
  }
)

export default followRouter
