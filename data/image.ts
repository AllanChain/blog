import { readdirSync, stat, createWriteStream } from 'fs'
import { resolve as resolvePath, join, extname } from 'path'
import { promisify } from 'util'
import { createHash } from 'crypto'
import axios from 'axios'
import { getExtension } from 'mime'
import sharp from 'sharp'

const imageCacheDir = resolvePath(process.cwd(), 'data/.cache/images')
const isGitHubImageAbbr = (s: string) =>
  /^[\da-f-]+\.(png|jpe?g|gif|webp)$/.test(s)
const expandGitHubImageAbbr = (s: string, userId: string) =>
  `https://user-images.githubusercontent.com/${userId}/${s}`
const isInternetImage = (s: string) => s.startsWith('http')
const resolveDest = (filename: string) => join(imageCacheDir, filename)

const guessUnknownFilename = (hash: string) => {
  for (const file of readdirSync(imageCacheDir)) {
    if (file.startsWith(hash)) return file
  }
  return null
}

const getImageDownloadLocation = async (
  url: string
): Promise<{ filename: string; dest: string }> => {
  const hasher = createHash('sha256')
  hasher.update(url)
  const hash = hasher.digest('hex').slice(0, 8)
  const ext = extname(url)
  const filename = ext ? `${hash}${ext}` : guessUnknownFilename(hash)

  if (filename) {
    const dest = resolveDest(filename)

    try {
      const stats = await promisify(stat)(dest)
      if (stats.size > 100) return { filename, dest }
      console.log(`    ${dest} too small`)
    } catch (err) {
      if (err.code !== 'ENOENT') throw err
    }
  }

  console.log(`    Downloading ${filename || hash} (${url})`)

  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream',
    })
    // note mime returns ext without dot
    let ext = getExtension(response.headers['content-type'])
    if (ext === 'jpeg') ext = 'jpg' // prefer jpg extension
    const filename = `${hash}.${ext}`
    const dest = resolveDest(filename)
    const writer = createWriteStream(dest)
    response.data.pipe(writer)
    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve({ filename, dest }))
      writer.on('error', reject)
    })
  } catch (err) {
    console.error(`::error:: Cannot fetch ${url} : ${err}`)
    throw err
  }
}

const getImageInfo = async (url: string) => {
  const { filename, dest } = await getImageDownloadLocation(url)

  try {
    const { data } = await sharp(dest)
      .jpeg({ quality: 10 })
      .resize(9)
      .toBuffer({ resolveWithObject: true })

    return {
      lazySrc: data.toString('base64'),
      src: process.env.GRIDSOME_BASE_URL + 'img/' + filename,
    }
  } catch (err) {
    throw new Error(`Cannot process ${dest}: ${err.message}`)
  }
}

export const useCachedLabelLogo = async (userId: string, label) => {
  if (!label.logo) return

  let imageInfo

  console.log(`    Checking cache for label ${label.name}`)
  if (isGitHubImageAbbr(label.logo)) {
    imageInfo = await getImageInfo(expandGitHubImageAbbr(label.logo, userId))
  } else if (isInternetImage(label.logo)) {
    imageInfo = await getImageInfo(label.logo)
  } // else do nothing, backward capability

  label.logo = imageInfo.src
  label.logoLazy = imageInfo.lazySrc
}

export const useCachedPostImage = async (post) => {
  if (!post.image) return
  console.log(`    Checking cache for label ${post.id}`)
  const imageInfo = await getImageInfo(post.image)
  post.image = imageInfo.src
  post.imageLazy = imageInfo.lazySrc
}
