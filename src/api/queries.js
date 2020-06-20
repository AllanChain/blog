module.exports = {
  data: `
  query($repo: String!, $owner: String!, $postCount: Int!, $postLabels: [String!], $postLabelCount: Int!, $labelCount: Int!) {
    repository(name: $repo, owner: $owner) {
      issues(first: $postCount, labels: $postLabels) {
        edges {
          node {
            number
            title
            bodyHTML
            createdAt
            lastEditedAt
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
  search: `{
    search(
      first: 2,
      query: "网易 user:AllanChain repo:blog label:\\"blog: programing\\"",
      type: ISSUE
    ) {
      edges {
        node {
          ... on Issue {
            title
            number
          }
        }
      }
    }
  }`
}
