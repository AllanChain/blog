import type { BlogsQuery, ReactionContent } from './sdk'

export type QueryIssue = BlogsQuery['repository']['issues']['nodes'][0]
export type QueryLabel = BlogsQuery['repository']['labels']['nodes'][0]
export type QueryComment = QueryIssue['comments']['nodes'][0]
export type QueryReactionGroup = QueryComment['reactionGroups'][0]

export interface Image {
  lazySrc: string
  src: string
  width: number
  height: number
}

export interface ReactionGroup {
  ID: ReactionContent
  emoji: string
  count: number
  users: string[]
}

export type Comment = Omit<QueryComment, 'reactionGroups'> & {
  reactions: ReactionGroup[]
}

export interface BlogLabel extends QueryLabel {
  id: string
  type: string
  reference: number
  logo?: Image
}

export interface BlogPost {
  id: number
  slug: string
  body: string
  serializedHeadings: string
  summary?: string
  summaryText?: string
  image?: Image
  imageAlt?: string
  url: string
  createdAt: Date
  lastEditedAt: Date
  title: string
  labels: BlogLabel[]
  reactions: ReactionGroup[]
  comments: Comment[]
}

export interface Friend {
  name: string
  blog: string
  avatar: string
  moto: string
}

export interface ExtraData {
  includedLabelTypes: string[]
  friends: Friend[]
}
