const axios = require('axios')

const query = `{
  repository(name: "blog", owner: "AllanChain") {
    issues(first: 10, labels: ["blog: programing"]) {
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
}`

const patterns = {
  slug: /^\[View Post on Blog\]\(https.*blog\/(.*)\)$/m,
  createTime: /^\*This post was originally created at (.*)\*$/m,
  summary: /^> (.*)/m
}

const gql = async () => {
  const resp = await axios({
    method: 'post',
    url: 'https://api.github.com/graphql',
    data: { query },
    headers: {
      Authorization: 'bearer bc48cb2be22ab0b18b1a5dd0daa3dcc6501b5632'
    }
  })
  //          axios gql
  return resp.data.data.repository
}

const matchFirst = (pattern, text) => {
  const result = text.match(pattern)
  if (result === null) return null
  return result[1]
}

const parseBody = text => {
  text = text.split('---', 2)[0]
  const result = {}
  for (const key in patterns) {
    result[key] = matchFirst(patterns[key], text)
  }
  result.id = result.slug
  return result
}

module.exports = async () => {
  const repo = await gql()
  const posts = repo.issues.edges.map(edge => ({
    ...parseBody(edge.node.body),
    title: edge.node.title,
    body: edge.node.body,
    labels: edge.node.labels.edges.map(edge => edge.node.name)
  }))
  const labels = repo.labels.edges.map(edge => edge.node)
  return { posts, labels }
}
