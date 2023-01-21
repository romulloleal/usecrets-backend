import axios from 'axios'
import multer from 'multer'
import FormData from 'form-data'
import AppError from '@shared/errors/AppError'

const storage = multer.memoryStorage()

const uploadImageToRepository = async ({
  file,
  folder,
}: {
  file: Express.Multer.File
  folder: string
}) => {
  const formData = new FormData()

  if (file.mimetype.split('/')[0] !== 'image') {
    throw new AppError('onlyImagesAccepted')
  }

  formData.append('image', file.buffer, { filename: file.originalname })
  formData.append('folder', folder)
  const response = await axios.post(
    `${process.env.IMAGES_REPOSITORY_URL}/uploadImage`,
    formData,
    {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
        privateKey: process.env.IMAGES_REPOSITORY_PRIVATE_KEY as string,
      },
    }
  )

  return response.data.fileName
}

const deleteImage = async ({
  imageName,
  folder,
}: {
  imageName: string
  folder: string
}) => {
  await axios.post(
    `${process.env.IMAGES_REPOSITORY_URL}/deleteImage`,
    {
      imageName,
      folder,
    },
    {
      headers: {
        privateKey: process.env.IMAGES_REPOSITORY_PRIVATE_KEY as string,
      },
    }
  )
}

export default {
  uploadImage: multer({ storage }).single('image'),
  uploadImageToRepository,
  deleteImage,
}
