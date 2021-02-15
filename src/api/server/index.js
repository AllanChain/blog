const fs = require('fs')
const path = require('path')

const yaml = require('js-yaml')
const axios = require('axios')

const config = require('../../config')
const { isGoodLabel, parseLabel, parsePost } = require('./parser')
const { useCachedLabelLogo } = require('./image')

const cacheDir = path.resolve(__dirname, '../../assets/.cache')
const imageCacheDir = path.resolve(cacheDir, 'images')
const serverData = async (variables) => {
  const query = fs.readFileSync(
    path.resolve(__dirname, './data.gql'),
    { encoding: 'utf-8' }
  )
  let resp
  variables = { ...config.gqlVar, ...variables }

  try {
    resp = await axios({
      method: 'post',
      url: 'https://api.github.com/graphql',
      data: { query, variables },
      headers: {
        Authorization: `bearer ${process.env.GITHUB_TOKEN}`
      }
    })
  } catch (error) {
    if (error.response) {
      console.error('::error::', error.response.data)
    } else {
      console.error('::error::', error.message)
    }
    throw error
  }
  if (resp.data.errors) {
    console.log(resp.data.errors)
    throw resp.data.errors[0].message
  }
  //          axios gql
  return resp.data.data
}

const getCacheFirstData = async () => {
  const cacheFile = path.resolve(cacheDir, 'data.json')
  if (process.env.NODE_ENV === 'development' && fs.existsSync(cacheFile)) {
    return JSON.parse(fs.readFileSync(cacheFile, { encoding: 'utf-8' }))
  }
  const repo = (await serverData()).repository
  fs.writeFileSync(cacheFile, JSON.stringify(repo), { encoding: 'utf-8' })
  return repo
}

const writeExtraData = (extraData) => {
  fs.writeFileSync(
    path.resolve(cacheDir, 'extra.json'),
    JSON.stringify(extraData),
    { encoding: 'utf-8' }
  )
}

module.exports = async () => {
  fs.mkdirSync(imageCacheDir, { recursive: true }) // ignore already exists
  const repo = await getCacheFirstData()
  const extraData = yaml.safeLoad(repo.extraData.bodyText)
  writeExtraData(extraData)
  const posts = repo.issues.nodes.map(parsePost)
  const labels = repo.labels.nodes.filter(isGoodLabel).map(parseLabel)
  await Promise.all(labels.map(
    useCachedLabelLogo.bind(null, repo.owner.databaseId)
  ))
  return { posts, labels }
}
