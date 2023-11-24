import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { gql, GraphQLClient } from 'graphql-request'
import { load as loadYAML } from 'js-yaml'
import { resolve as resolvePath } from 'path'

import { gqlVar } from './config'
import { transformLabelLogo, transformPostImage } from './image'
import { parseLabel, parsePost } from './parser'
import { getSdk, BlogsQuery } from './sdk'
import type { BlogLabel, BlogPost, ExtraData } from './types'

const cacheDir = resolvePath(process.cwd(), 'data/.cache')
const imageCacheDir = resolvePath(process.cwd(), 'public/img')

const client = new GraphQLClient('https://api.github.com/graphql', {
  headers: {
    authorization: `bearer ${import.meta.env.GITHUB_TOKEN}`,
  },
})
const sdk = getSdk(client)

const wrapFetchError = <T>(p: Promise<T>): Promise<T> =>
  p.catch((error) => {
    if (error.response) {
      console.error('::error::', error.response.data)
    } else {
      console.error('::error::', error.message)
    }
    throw error
  })

const getCacheFirstData = async (): Promise<BlogsQuery['repository']> => {
  const cacheFile = resolvePath(cacheDir, 'data.json')

  if (existsSync(cacheFile)) {
    return JSON.parse(readFileSync(cacheFile, { encoding: 'utf-8' }))
  }
  const repo = (await wrapFetchError(sdk.blogs(gqlVar))).repository
  let pageInfo = repo.issues.pageInfo
  while (pageInfo.hasNextPage) {
    const morePosts = (
      await wrapFetchError(
        sdk.morePosts({
          ...gqlVar,
          afterPost: pageInfo.endCursor,
        }),
      )
    ).repository.issues
    pageInfo = morePosts.pageInfo
    repo.issues.nodes.push(...morePosts.nodes)
  }
  writeFileSync(cacheFile, JSON.stringify(repo, null, 2), { encoding: 'utf-8' })
  return repo
}

const writeExtraData = (extraData: ExtraData) => {
  writeFileSync(
    resolvePath(cacheDir, 'extra.json'),
    JSON.stringify(extraData, null, 2),
    {
      encoding: 'utf-8',
    },
  )
}

export default (async (): Promise<{
  posts: BlogPost[]
  labels: Record<string, BlogLabel>
  extraData: ExtraData
}> => {
  console.log('Preparing blog data...')
  mkdirSync(imageCacheDir, { recursive: true }) // ignore already exists
  mkdirSync(cacheDir, { recursive: true }) // ignore already exists

  console.log('  Fetching GitHub GraphQL data...')
  const repo = await getCacheFirstData()
  const extraData = loadYAML(repo.extraData.bodyText) as ExtraData
  writeExtraData(extraData)
  console.log('  Processing posts...')
  const parsedPosts = (await Promise.all(repo.issues.nodes.map(parsePost))).sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  )
  const labels: Record<string, BlogLabel> = {}

  console.log('  Fetching label logos...')

  const isGoodLabel = (labelName: string) => {
    const result = labelName.split(': ')
    const { includedLabelTypes } = extraData
    return result.length === 2 && includedLabelTypes.includes(result[0])
  }

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
        labels: Object.values(labels)
          .filter((label) => post.labels.includes(label.id))
          .sort((a, b) => {
            if (a.id > b.id) {
              return 1
            }
            if (a.id < b.id) {
              return -1
            }
            return 0
          }),
      }))
      .map(transformPostImage),
  )
  posts.forEach((post) => {
    post.labels.forEach((label) => {
      label.reference += 1
    })
  })

  console.log('  Fetching post images...')
  console.log('Done!')
  return { posts, labels, extraData }
})()
