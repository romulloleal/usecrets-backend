import { Router } from 'express'

import ensureAuthenticated from '@middlewares/ensureAuthenticated'
import CreatePostService from '@modules/posts/services/CreatePostService'
import GetPostsFromFollowedProfilesService from '@modules/posts/services/GetPostsFromFollowedProfilesService'
import LikeUnlikePostService from '@modules/posts/services/LikeUnlikePostService'
import uploadConfig from '@config/upload'
import GetProfilePostsService from '@modules/posts/services/GetProfilePostsService'
import GetAllPostsService from '@modules/posts/services/GetAllPostsService'
import DeletePostService from '@modules/posts/services/DeletePostService'
import GetPostService from '@modules/posts/services/GetPostService'

const postRouter = Router()

postRouter.post(
  '/createPost',
  uploadConfig.storage,
  ensureAuthenticated,
  async (request, response) => {
    const { text } = request.body

    let image = undefined

    if (request.file) {
      image = await uploadConfig.uploadImage({
        file: request.file,
        folder: 'post',
      })
    }

    const loggedUserId = request.user.id

    const createPost = new CreatePostService()

    const post = await createPost.execute({
      text,
      image,
      loggedUserId,
    })

    return response.json({
      status: 'success',
      data: post,
    })
  }
)

postRouter.post(
  '/getPostsFromFollowedProfiles',
  ensureAuthenticated,
  async (request, response) => {
    const { skip } = request.body

    const loggedUserId = request.user.id

    const getPosts = new GetPostsFromFollowedProfilesService()

    const posts = await getPosts.execute({
      skip: skip,
      loggedUserId,
    })

    return response.json({
      status: 'success',
      data: posts,
    })
  }
)

// get recent posts from public profiles
postRouter.post('/explore', async (request, response) => {
  const { skip, loggedUserId } = request.body

  const getPosts = new GetAllPostsService()

  const posts = await getPosts.execute({
    skip: skip,
    loggedUserId,
  })

  return response.json({
    status: 'success',
    data: posts,
  })
})

postRouter.post('/getProfilePosts', async (request, response) => {
  const { skip, userName, loggedUserId } = request.body

  const getPosts = new GetProfilePostsService()

  const posts = await getPosts.execute({
    skip: skip,
    loggedUserId,
    userName,
  })

  return response.json({
    status: 'success',
    data: posts,
  })
})

postRouter.post(
  '/likeUnlikePost',
  ensureAuthenticated,
  async (request, response) => {
    const { postId } = request.body

    const loggedUserId = request.user.id

    const likeUnlikePost = new LikeUnlikePostService()

    await likeUnlikePost.execute({ postId, loggedUserId })

    return response.json({
      status: 'success',
    })
  }
)

postRouter.post(
  '/deletePost',
  ensureAuthenticated,
  async (request, response) => {
    const { postId } = request.body

    const loggedUserId = request.user.id

    const deletePost = new DeletePostService()

    await deletePost.execute({ postId, loggedUserId })

    return response.json({
      status: 'success',
    })
  }
)

postRouter.post('/getPost', async (request, response) => {
  const { postId, loggedUserId } = request.body

  const getPost = new GetPostService()

  const post = await getPost.execute({ postId, loggedUserId })

  return response.json({
    status: 'success',
    data: post,
  })
})

export default postRouter
