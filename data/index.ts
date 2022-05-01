import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { resolve } from 'path'

import { load as loadYAML } from 'js-yaml'

import { gqlVar } from './config'
import { isGoodLabel, parseLabel, parsePost } from './parser'
import { useCachedLabelLogo, useCachedPostImage } from './image'
import { getSdk, BlogsQueryVariables, BlogsQuery } from './sdk'
import { GraphQLClient } from 'graphql-request'

const cacheDir = resolve(import.meta.env.DATA_DIR, '.cache')
const imageCacheDir = resolve(cacheDir, 'images')

const client = new GraphQLClient('https://api.github.com/graphql', {
  headers: {
    authorization: `bearer ${import.meta.env.GITHUB_TOKEN}`,
  },
})
const sdk = getSdk(client)

const serverData = async (variables: Partial<BlogsQueryVariables> = {}) => {
  const data = await sdk.blogs({ ...gqlVar, ...variables }).catch((error) => {
    if (error.response) {
      console.error('::error::', error.response.data)
    } else {
      console.error('::error::', error.message)
    }
    throw error
  })

  return data
}

const getCacheFirstData = async (): Promise<BlogsQuery['repository']> => {
  const cacheFile = resolve(cacheDir, 'data.json')

  if (process.env.NODE_ENV === 'development' && existsSync(cacheFile)) {
    return JSON.parse(readFileSync(cacheFile, { encoding: 'utf-8' }))
  }
  const repo = (await serverData()).repository
  writeFileSync(cacheFile, JSON.stringify(repo), { encoding: 'utf-8' })
  return repo
}

const writeExtraData = (extraData) => {
  writeFileSync(resolve(cacheDir, 'extra.json'), JSON.stringify(extraData), {
    encoding: 'utf-8',
  })
}

export default (async () => {
  console.log('Preparing blog data...')
  mkdirSync(imageCacheDir, { recursive: true }) // ignore already exists

  console.log('  Fetching GitHub GraphQL data...')
  const repo = await getCacheFirstData()
  const extraData = loadYAML(repo.extraData.bodyText)
  writeExtraData(extraData)
  const posts = repo.issues.nodes.map(parsePost)
  const labels = repo.labels.nodes
    .filter((label) => isGoodLabel(label.name))
    .map(parseLabel)

  console.log('  Fetching label logos...')
  if (!('databaseId' in repo.owner)) throw new Error('Owner is not a user')
  const userDatabaseId = repo.owner.databaseId
  await Promise.all(labels.map(useCachedLabelLogo.bind(null, userDatabaseId)))

  console.log('  Fetching post images...')
  await Promise.all(posts.map(useCachedPostImage))
  return { posts, labels }
})()
