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
    $extraDataNumber: Int!
  ) {
    repository(name: $repo, owner: $owner) {
      issues(
        first: $postCount
        labels: $postLabels
        filterBy: { createdBy: $owner }
      ) {
        nodes {
          number
          title
          bodyHTML
          createdAt
          includesCreatedEdit
          lastEditedAt
          reactions(first: $reactionCount) {
            nodes {
              content
              user {
                login
              }
            }
          }
          labels(first: $postLabelCount) {
            nodes {
              name
            }
          }
        }
      }
      extraData: issue(number: $extraDataNumber) {
        bodyText
      }
      labels(first: $labelCount) {
        nodes {
          name
          color
          description
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
          nodes {
            content
            user {
              login
            }
          }
        }
        comments(first: $commentCount) {
          nodes {
            id
            resourcePath
            author {
              avatarUrl(size: 64)
              login
            }
            bodyHTML
            createdAt
            reactions(first: $reactionCount) {
              nodes {
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
  }`,
  search: `
  query($searchQuery: String!) {
    search(
      first: 5,
      query: $searchQuery,
      type: ISSUE
    ) {
      nodes {
        ... on Issue {
          number
        }
      }
    }
  }`
}
