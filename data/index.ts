import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { resolve as resolvePath } from 'path'

import { GraphQLClient } from 'graphql-request'
import { load as loadYAML } from 'js-yaml'

import { gqlVar } from './config'
import {
  isGoodLabel,
  ParsedLabel,
  ParsedPost,
  parseLabel,
  parsePost,
} from './parser'
import { useCachedLabelLogo, useCachedPostImage } from './image'
import { getSdk, BlogsQueryVariables, BlogsQuery } from './sdk'

const cacheDir = resolvePath(process.cwd(), 'data/.cache')
const imageCacheDir = resolvePath(cacheDir, 'images')

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
  const cacheFile = resolvePath(cacheDir, 'data.json')

  if (process.env.NODE_ENV === 'development' && existsSync(cacheFile)) {
    return JSON.parse(readFileSync(cacheFile, { encoding: 'utf-8' }))
  }
  const repo = (await serverData()).repository
  writeFileSync(cacheFile, JSON.stringify(repo), { encoding: 'utf-8' })
  return repo
}

const writeExtraData = (extraData) => {
  writeFileSync(
    resolvePath(cacheDir, 'extra.json'),
    JSON.stringify(extraData),
    {
      encoding: 'utf-8',
    }
  )
}

export interface BlogPost extends ParsedPost {
  imageLazy?: string
}

export interface BlogLabel extends ParsedLabel {
  logoLazy?: string
}

export default (async () => {
  console.log('Preparing blog data...')
  mkdirSync(imageCacheDir, { recursive: true }) // ignore already exists

  console.log('  Fetching GitHub GraphQL data...')
  const repo = await getCacheFirstData()
  const extraData = loadYAML(repo.extraData.bodyText)
  writeExtraData(extraData)
  console.log('  Processing posts...')
  const posts = await Promise.all(repo.issues.nodes.map(parsePost))
  const labels: Record<string, ParsedLabel> = {}

  console.log('  Fetching label logos...')
  if (!('databaseId' in repo.owner)) throw new Error('Owner is not a user')
  const userDatabaseId = String(repo.owner.databaseId)
  for (const label of repo.labels.nodes) {
    if (isGoodLabel(label.name)) {
      labels[label.name] = await useCachedLabelLogo(
        userDatabaseId,
        parseLabel(label)
      )
    }
  }

  console.log('  Fetching post images...')
  await Promise.all(posts.map(useCachedPostImage))
  console.log('Done!')
  return { posts, labels }
})()
