import fs from 'fs'
import path from 'path'

import yaml from 'js-yaml'
import axios from 'axios'

import { gqlVar } from '../config'
import { isGoodLabel, parseLabel, parsePost } from './parser'
import { useCachedLabelLogo, useCachedPostImage } from './image'

const cacheDir = path.resolve(import.meta.env.DATA_DIR, '.cache')
const imageCacheDir = path.resolve(cacheDir, 'images')

const serverData = async (variables) => {
  const query = fs.readFileSync(
    path.resolve(import.meta.env.DATA_DIR, './server/data.gql'),
    { encoding: 'utf-8' }
  )
  let resp
  variables = { ...gqlVar, ...variables }

  try {
    resp = await axios({
      method: 'post',
      url: 'https://api.github.com/graphql',
      data: { query, variables },
      headers: {
        Authorization: `bearer ${import.meta.env.GITHUB_TOKEN}`,
      },
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

export default async () => {
  console.log('Preparing blog data...')
  fs.mkdirSync(imageCacheDir, { recursive: true }) // ignore already exists

  console.log('  Fetching GitHub GraphQL data...')
  const repo = await getCacheFirstData()
  const extraData = yaml.load(repo.extraData.bodyText)
  writeExtraData(extraData)
  const posts = repo.issues.nodes.map(parsePost)
  const labels = repo.labels.nodes.filter(isGoodLabel).map(parseLabel)

  console.log('  Fetching label logos...')
  await Promise.all(
    labels.map(useCachedLabelLogo.bind(null, repo.owner.databaseId))
  )

  console.log('  Fetching post images...')
  await Promise.all(posts.map(useCachedPostImage))
  return { posts, labels }
}
