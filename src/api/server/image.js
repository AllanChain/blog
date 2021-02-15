const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const axios = require('axios')

const imageCacheDir = path.resolve(__dirname, '../../assets/.cache/images')
const isGitHubImageAbbr = s => /^[\da-f-]+\.(png|jpe?g|gif|webp)$/.test(s)
const expandGitHubImageAbbr = (s, userId) =>
  `https://user-images.githubusercontent.com/${userId}/${s}`
const isInternetImage = s => s.startsWith('http')
const getImageDownloadLocation = async (url, id) => {
  const filename = `${id}${path.extname(url)}`
  const dest = `${imageCacheDir}/${filename}`
  // `@cache` is a fake alias which will be expanded in `util.fixUrl`
  // This is a workaroud for webpack to bundle .cache/images
  const asset = `@cache/${filename}`
  try {
    const stats = await promisify(fs.stat)(dest)
    if (stats.size > 1000) return asset
  } catch (err) {
    if (err.code !== 'ENOENT') throw err
  }
  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream'
    })
    await response.data.pipe(fs.createWriteStream(dest))
    return asset
  } catch (err) {
    console.error(`::error:: Cannot fetch ${filename}( ${url} ): ${err}`)
    throw err
  }
}
const useCachedLabelLogo = async (userId, label) => {
  if (!label.logo) return
  const id = label.id.replace(/[: ]/g, '-')
  if (isGitHubImageAbbr(label.logo)) {
    label.logo = await getImageDownloadLocation(
      expandGitHubImageAbbr(label.logo, userId), id
    )
  } else if (isInternetImage(label.logo)) {
    label.logo = await getImageDownloadLocation(label.logo, id)
  } // else don nothing, backward capability
}
module.exports = {
  useCachedLabelLogo
}
