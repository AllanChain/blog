// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`
const axios = require('axios')

const gql = async (query) => {
  const resp = await axios({
    method: 'post',
    url: 'https://api.github.com/graphql',
    data: { query },
    headers: {
      Authorization: 'bearer bc48cb2be22ab0b18b1a5dd0daa3dcc6501b5632'
    }
  })
  //          axios gql
  return resp.data.data
}

module.exports = function (api) {
  api.loadSource(async ({ addCollection }) => {
    const resp = await gql(`{
      repository(name: "blog", owner: "AllanChain") {
        issues(first: 10) {
          edges {
            node {
              title
              body
              labels(first: 5) {
                edges {
                  node {
                    name
                  }
                }
              }
            }
          }
        }
        labels(first: 5) {
          edges {
            node {
              name
              color
              description
            }
          }
        }
      }
    }`)
    const blogCollection = addCollection('blogs')
    for (edge of resp.repository.issues.edges) {
      console.log(edge)
      blogCollection.addNode(edge.node)
    }
    // Use the Data Store API here: https://gridsome.org/docs/data-store-api/
  })

  api.createPages(({ createPage }) => {
    // Use the Pages API here: https://gridsome.org/docs/pages-api/
  })
}
