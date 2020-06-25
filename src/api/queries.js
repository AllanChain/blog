module.exports = {
  data: `
  query(
    $repo: String!
    $owner: String!
    $postCount: Int!
    $postLabels: [String!]
    $postLabelCount: Int!
    $labelCount: Int!
    $reactionCount: Int!
  ) {
    repository(name: $repo, owner: $owner) {
      issues(
        first: $postCount
        labels: $postLabels
        filterBy: { createdBy: $owner }
      ) {
        edges {
          node {
            number
            title
            bodyHTML
            createdAt
            includesCreatedEdit
            lastEditedAt
            reactions(first: $reactionCount) {
              edges {
                node {
                  content
                  user {
                    login
                  }
                }
              }
            }
            labels(first: $postLabelCount) {
              edges {
                node {
                  name
                }
              }
            }
          }
        }
      }
      labels(first: $labelCount) {
        edges {
          node {
            name
            color
            description
          }
        }
      }
    }
  }`,
  comment: `
  query(
    $repo: String!,
    $owner: String!,
    $postNumber: Int!,
    $commentCount: Int!,
    $reactionCount: Int!
  ) {
    repository(name: $repo, owner: $owner) {
      issue(number: $postNumber) {
        reactions(first: $reactionCount) {
          edges {
            node {
              content
              user {
                login
              }
            }
          }
        }
        comments(first: $commentCount) {
          edges {
            node {
              id
              resourcePath
              author {
                avatarUrl(size: 64)
                login
              }
              bodyHTML
              createdAt
              reactions(first: $reactionCount) {
                edges {
                  node {
                    content
                    user {
                      login
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }`,
  search: `
  query($searchQuery: String!) {
    search(
      first: 5,
      query: $searchQuery,
      type: ISSUE
    ) {
      edges {
        node {
          ... on Issue {
            number
          }
        }
      }
    }
  }`
}
