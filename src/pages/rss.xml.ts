import rss from '@astrojs/rss'
import dataPromise from '@data'

export const GET = async () => {
  const { posts } = await dataPromise
  return rss({
    title: 'AC Dustbin',
    description: 'A home for every piece of my dust.',
    site: 'https://allanchain.github.io/blog/post/',
    items: posts.map((post) => ({
      link: post.slug,
      title: post.title,
      pubDate: post.createdAt,
      description: post.summary,
    })),
  })
}
