import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { resolve as resolvePath } from 'path'

import { GraphQLClient } from 'graphql-request'
import { load as loadYAML } from 'js-yaml'

import { gqlVar } from './config'
import { isGoodLabel, parseLabel, parsePost } from './parser'
import type { BlogLabel, BlogPost } from './types'
import { transformLabelLogo, transformPostImage } from './image'
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

export default (async (): Promise<{
  posts: BlogPost[]
  labels: Record<string, BlogLabel>
}> => {
  console.log('Preparing blog data...')
  mkdirSync(imageCacheDir, { recursive: true }) // ignore already exists

  console.log('  Fetching GitHub GraphQL data...')
  const repo = await getCacheFirstData()
  const extraData = loadYAML(repo.extraData.bodyText)
  writeExtraData(extraData)
  console.log('  Processing posts...')
  const parsedPosts = (
    await Promise.all(repo.issues.nodes.map(parsePost))
  ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  const labels: Record<string, BlogLabel> = {}

  console.log('  Fetching label logos...')
  if (!('databaseId' in repo.owner)) throw new Error('Owner is not a user')
  const userDatabaseId = String(repo.owner.databaseId)
  for (const label of repo.labels.nodes) {
    if (isGoodLabel(label.name)) {
      labels[label.name] = await transformLabelLogo(userDatabaseId, {
        ...parseLabel(label),
        reference: 0,
      })
    }
  }
  const posts = await Promise.all(
    parsedPosts
      .map((post) => ({
        ...post,
        labels: Object.values(labels).filter((label) =>
          post.labels.includes(label.id)
        ),
      }))
      .map(transformPostImage)
  )
  posts.forEach((post) => {
    post.labels.forEach((label) => {
      label.reference += 1
    })
  })

  console.log('  Fetching post images...')
  console.log('Done!')
  return { posts, labels }
})()
