import multer from 'multer'
import path from 'path'
import crypto from 'crypto'
import sharp from 'sharp'
import fs from 'fs'

const postImagesFolder = path.resolve(__dirname, '..', '..', 'images', 'post')
const profileImagesFolder = path.resolve(
  __dirname,
  '..',
  '..',
  'images',
  'profile'
)
const coverImagesFolder = path.resolve(__dirname, '..', '..', 'images', 'cover')
const storage = multer.memoryStorage()

const uploadImage = async ({
  file,
  folder,
}: {
  file: Express.Multer.File
  folder: string
}) => {
  const directoryFolder =
    folder === 'post'
      ? postImagesFolder
      : folder === 'profile'
      ? profileImagesFolder
      : coverImagesFolder

  const fileHash = crypto.randomBytes(10).toString('hex')
  const fileName = `${fileHash}-${new Date().getTime()}.webP`

  await sharp(file?.buffer, { animated: true })
    .rotate()
    .webp({ quality: 20 })
    .toFile(path.resolve(directoryFolder, fileName))

  return fileName
}

const deleteImage = async ({
  imageName,
  folder,
}: {
  imageName: string
  folder: string
}) => {
  const directoryFolder =
    folder === 'post'
      ? postImagesFolder
      : folder === 'profile'
      ? profileImagesFolder
      : coverImagesFolder

  const fileExists = fs.existsSync(path.resolve(directoryFolder, imageName))

  if (fileExists) fs.unlinkSync(path.resolve(directoryFolder, imageName))
}

export default {
  postImagesFolder,
  profileImagesFolder,
  coverImagesFolder,
  storage: multer({ storage }).single('image'),
  uploadImage,
  deleteImage,
}
