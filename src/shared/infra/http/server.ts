import 'reflect-metadata'

import * as dotenv from 'dotenv'
dotenv.config()

process.env.TZ = 'UTC'

import express, { NextFunction, Request, Response } from 'express'
import 'express-async-errors'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'
import uploadConfig from '@config/upload'

import routes from './routes'
import AppError from '@shared/errors/AppError'

import { AppDataSource } from '@shared/infra/typeorm'

AppDataSource.initialize()

const app = express()
const serverHttp = http.createServer(app)

const socket = new Server(serverHttp, {
  cors: {
    origin: [process.env.APP_BASEURL as string, 'http://localhost:3000'],
  },
})

socket.on('connection', socket => {
  socket.on('joinRoom', roomName => {
    socket.join(roomName)
  })
})

app.use(cors())
app.use(express.json())
app.use('/files/post', express.static(uploadConfig.postImagesFolder))
app.use('/files/profile', express.static(uploadConfig.profileImagesFolder))
app.use('/files/cover', express.static(uploadConfig.coverImagesFolder))
app.use(routes, (_, res) => res.status(404).send('404 not found'))

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        status: 'error',
        message: err.message,
      })
    }

    return response.status(500).json({
      status: 'error',
      message: 'internalServerError',
      err: err.message,
    })
  }
)

serverHttp.listen(process.env.PORT || 3335, () => {
  console.log('🚀 Server started on port 3335!')
})

export { socket }
