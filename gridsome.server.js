// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`
const githubData = require('./api.github')

module.exports = (api) => {
  const dataPromise = githubData()
  api.loadSource(async ({ addCollection }) => {
    const { blogs, labels } = await dataPromise
    const blogCollection = addCollection('blogs')
    for (const blog of blogs) {
      console.log(blog)
      blogCollection.addNode(blog)
    }
    const labelCollection = addCollection('labels')
    console.log(labels)
    for (const label of labels) {
      console.log(label)
      labelCollection.addNode(label)
    }
    // Use the Data Store API here: https://gridsome.org/docs/data-store-api/
  })

  api.createPages(({ createPage }) => {
    // Use the Pages API here: https://gridsome.org/docs/pages-api/
  })
}
