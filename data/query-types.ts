import type { BlogsQuery } from './sdk'
export type BlogIssue = BlogsQuery['repository']['issues']['nodes'][0]
export type BlogLabel = BlogsQuery['repository']['labels']['nodes'][0]
export type BlogComment = BlogIssue['comments']['nodes'][0]
export type ReactionGroup = BlogComment['reactionGroups'][0]
