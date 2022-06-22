import { readdirSync, stat, createWriteStream } from 'fs'
import { resolve as resolvePath, join, extname } from 'path'
import { promisify } from 'util'
import { createHash } from 'crypto'
import axios from 'axios'
import mime from 'mime'
const { getExtension } = mime
import sharp from 'sharp'

import type {
  BlogLabel,
  BlogPost,
  Image,
  UnimagedBlogLabel,
  UnimagedBlogPost,
} from './types'

const imageCacheDir = resolvePath(process.cwd(), 'public/img')
const isGitHubImageAbbr = (s: string) =>
  /^[\da-f-]+\.(png|jpe?g|gif|webp)$/.test(s)
const expandGitHubImageAbbr = (s: string, userId: string) =>
  `https://user-images.githubusercontent.com/${userId}/${s}`
const isInternetImage = (s: string) => s.startsWith('http')
const isGitHubHostedImage = (s: string) =>
  /user-images.githubusercontent.com/.test(s)
const resolveDest = (filename: string) => join(imageCacheDir, filename)

const guessUnknownFilename = (hash: string) => {
  for (const file of readdirSync(imageCacheDir)) {
    if (file.startsWith(hash)) return file
  }
  return null
}

const getImageDownloadLocation = async (
  url: string,
  hint?: string
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

  console.log(`    [${hint}] Downloading ${filename || hash} (${url})`)

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
    console.error(`::error:: [${hint}] Cannot fetch ${url} : ${err}`)
    throw err
  }
}

const getImageInfo = async (url: string, hint?: string): Promise<Image> => {
  if (!isGitHubHostedImage(url)) {
    console.warn(`::warn:: [${hint}] ${url} is not a GitHub hosted image`)
  }
  const { filename, dest } = await getImageDownloadLocation(url, hint)

  try {
    const { width, height } = await sharp(dest).metadata()
    const origExt = extname(filename)
    // The quality of PNG outperforms JPEG when both in 500 B.
    const ext = 'png'
    const lazyDest = dest.replace(origExt, `.low-res.${ext}`)
    const lazyFilename = filename.replace(origExt, `.low-res.${ext}`)
    await sharp(dest)
      .resize(12)
      .toFormat(ext, { quality: 10, compressionLevel: 9 })
      .toFile(lazyDest)

    const urlPrefix = import.meta.env.BASE_URL + 'img/'
    return {
      lazySrc: urlPrefix + lazyFilename,
      src: urlPrefix + filename,
      width,
      height,
    }
  } catch (err) {
    throw new Error(
      `::error:: [${hint}] Cannot process ${dest}: ${err.message}`
    )
  }
}

export const useCachedLabelLogo = async (
  userId: string,
  label: UnimagedBlogLabel
): Promise<BlogLabel> => {
  const hint = label.id
  return {
    ...label,
    logo:
      label.logo === undefined
        ? undefined
        : isGitHubImageAbbr(label.logo)
        ? await getImageInfo(expandGitHubImageAbbr(label.logo, userId), hint)
        : isInternetImage(label.logo)
        ? await getImageInfo(label.logo, hint)
        : undefined,
  }
}

export const useCachedPostImage = async (
  post: UnimagedBlogPost
): Promise<BlogPost> => {
  return {
    ...post,
    image: post.image ? await getImageInfo(post.image, post.slug) : undefined,
  }
}