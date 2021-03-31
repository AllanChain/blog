const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const { createHash } = require('crypto')
const axios = require('axios')
const mime = require('mime')

const imageCacheDir = path.resolve(__dirname, '../../assets/.cache/images')
const isGitHubImageAbbr = s => /^[\da-f-]+\.(png|jpe?g|gif|webp)$/.test(s)
const expandGitHubImageAbbr = (s, userId) =>
  `https://user-images.githubusercontent.com/${userId}/${s}`
const isInternetImage = s => s.startsWith('http')
const resolveDest = filename => ({
  dest: `${imageCacheDir}/${filename}`,
  // `@cache` is a fake alias which will be expanded in `util.fixUrl`
  // This is a workaroud for webpack to bundle .cache/images
  asset: `@cache/${filename}`
})

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
    const { dest, asset } = resolveDest(filename)

    try {
      const stats = await promisify(fs.stat)(dest)
      if (stats.size > 1000) return asset
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
    const { dest, asset } = resolveDest(`${hash}.${ext}`)
    await response.data.pipe(fs.createWriteStream(dest))
    return asset
  } catch (err) {
    console.error(`::error:: Cannot fetch ${url} : ${err}`)
    throw err
  }
}

const useCachedLabelLogo = async (userId, label) => {
  if (!label.logo) return

  if (isGitHubImageAbbr(label.logo)) {
    label.logo = await getImageDownloadLocation(
      expandGitHubImageAbbr(label.logo, userId)
    )
  } else if (isInternetImage(label.logo)) {
    label.logo = await getImageDownloadLocation(label.logo)
  } // else do nothing, backward capability
}

const useCachedPostImage = async post => {
  if (!post.image) return
  post.image = await getImageDownloadLocation(post.image)
}
module.exports = {
  useCachedLabelLogo,
  useCachedPostImage
}
