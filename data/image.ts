import { readdirSync } from 'fs'
import { stat } from 'fs/promises'
import { resolve as resolvePath, join } from 'path'
import { createHash } from 'crypto'
import axios from 'axios'
import sharp from 'sharp'

import type { Image } from './types'

const imageCacheDir = resolvePath(process.cwd(), 'public/img')

const isGitHubImageAbbr = (s: string) => /^[\da-f-]+\.(png|jpe?g|gif|webp)$/.test(s)
const expandGitHubImageAbbr = (s: string, userId: string) =>
  `https://user-images.githubusercontent.com/${userId}/${s}`
const isInternetImage = (s: string) => s.startsWith('http')
const isGitHubHostedImage = (s: string) =>
  /^https:\/\/user-images\.githubusercontent\.com/.test(s)
const resolveDest = (filename: string) => join(imageCacheDir, filename)

const getFileInfo = (hash: string) => {
  const filePattern = /[0-9a-f]{8}_(?<width>\d+)x(?<height>\d+)\.low-res\.png/
  for (const file of readdirSync(imageCacheDir)) {
    if (!file.startsWith(hash)) continue
    const match = file.match(filePattern)
    if (match === null) continue
    return {
      filename: file,
      width: parseInt(match.groups.width, 10),
      height: parseInt(match.groups.height, 10),
    }
  }
  return null
}

const getImageInfo = async (url: string, hint?: string): Promise<Image> => {
  if (!isGitHubHostedImage(url)) {
    console.warn(`::warning:: [${hint}] ${url} is not a GitHub hosted image`)
  }
  const urlPrefix = import.meta.env.BASE_URL + 'img/'
  const hasher = createHash('sha256')
  hasher.update(url)
  const hash = hasher.digest('hex').slice(0, 8)
  const fileInfo = getFileInfo(hash)

  if (fileInfo) {
    const dest = resolveDest(fileInfo.filename)

    try {
      const stats = await stat(dest)
      if (stats.size > 100)
        return {
          src: url,
          lazySrc: urlPrefix + fileInfo.filename,
          width: fileInfo.width,
          height: fileInfo.height,
        }
      console.log(`    ${dest} too small`)
    } catch (err) {
      if (err.code !== 'ENOENT') throw err
    }
  }

  console.log(`    [${hint}] Downloading ${fileInfo?.filename || hash} (${url})`)

  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream',
    })
    const pipeline = sharp()
    response.data.pipe(pipeline)
    const { height, width } = await pipeline.metadata()
    const filename = `${hash}_${width}x${height}.low-res.png`
    await pipeline
      .resize(12)
      .png({ quality: 10, compressionLevel: 9 })
      .toFile(resolveDest(filename))

    return {
      width,
      height,
      src: url,
      lazySrc: urlPrefix + filename,
    }
  } catch (err) {
    console.error(`::error:: [${hint}] Cannot process ${url} : ${err}`)
    throw err
  }
}

export const transformLabelLogo = async <T extends { id: string; logo?: string }>(
  userId: string,
  label: T
): Promise<Omit<T, 'logo'> & { logo: Image }> => {
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

export const transformPostImage = async <T extends { image?: string; slug: string }>(
  post: T
): Promise<Omit<T, 'image'> & { image: Image }> => {
  return {
    ...post,
    image: post.image ? await getImageInfo(post.image, post.slug) : undefined,
  }
}
