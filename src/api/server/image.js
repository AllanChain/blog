const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const { createHash } = require('crypto')
const axios = require('axios')
const mime = require('mime')
const sharp = require('sharp')
const { compressDataURI } = require('../../utils')

const imageCacheDir = path.resolve(__dirname, '../../assets/.cache/images')
const isGitHubImageAbbr = s => /^[\da-f-]+\.(png|jpe?g|gif|webp)$/.test(s)
const expandGitHubImageAbbr = (s, userId) =>
  `https://user-images.githubusercontent.com/${userId}/${s}`
const isInternetImage = s => s.startsWith('http')
const resolveDest = filename => path.join(imageCacheDir, filename)

const guessUnknownFilename = hash => {
  for (const file of fs.readdirSync(imageCacheDir)) {
    if (file.startsWith(hash)) return file
  }
  return null
}

const getImageDownloadLocation = async (url) => {
  const hasher = createHash('sha256')
  hasher.update(url)
  const hash = hasher.digest('hex').slice(0, 8)
  const ext = path.extname(url)
  const filename = ext
    ? `${hash}${ext}`
    : guessUnknownFilename(url, hash)

  if (filename) {
    const dest = resolveDest(filename)

    try {
      const stats = await promisify(fs.stat)(dest)
      if (stats.size > 1000) return { filename, dest }
    } catch (err) {
      if (err.code !== 'ENOENT') throw err
    }
  }

  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream'
    })
    // note mime returns ext without dot
    const ext = mime.getExtension(response.headers['content-type'])
    const filename = `${hash}.${ext}`
    const dest = resolveDest(filename)
    const writer = fs.createWriteStream(dest)
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

const getImageInfo = async (url) => {
  const { filename, dest } = await getImageDownloadLocation(url)

  try {
    const { data } = await sharp(dest)
      .jpeg({ quality: 10 })
      .resize(9)
      .toBuffer({ resolveWithObject: true })

    return {
      lazySrc: compressDataURI(data.toString('base64')),
      src: process.env.GRIDSOME_BASE_URL + 'img/' + filename
    }
  } catch (err) {
    throw new Error(`Cannot process ${dest}: ${err.message}`)
  }
}

const useCachedLabelLogo = async (userId, label) => {
  if (!label.logo) return

  let imageInfo

  if (isGitHubImageAbbr(label.logo)) {
    imageInfo = await getImageInfo(
      expandGitHubImageAbbr(label.logo, userId)
    )
  } else if (isInternetImage(label.logo)) {
    imageInfo = await getImageInfo(label.logo)
  } // else do nothing, backward capability

  label.logo = imageInfo.src
  label.logoLazy = imageInfo.lazySrc
}

const useCachedPostImage = async post => {
  if (!post.image) return
  const imageInfo = await getImageInfo(post.image)
  post.image = imageInfo.src
  post.imageLazy = imageInfo.lazySrc
}
module.exports = {
  useCachedLabelLogo,
  useCachedPostImage
}
