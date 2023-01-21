import { Router } from 'express'

import CreateUserService from '@modules/users/services/User/CreateUserService'

const userRouter = Router()

userRouter.post('/crateAccount', async (request, response) => {
  const { userName, email, password } = request.body

  const createUser = new CreateUserService()

  await createUser.execute({
    userName,
    email,
    password,
  })

  return response.json({
    status: 'success',
  })
})

export default userRouter
