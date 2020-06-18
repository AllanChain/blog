module.exports = {
  data: `{
    repository(name: "blog", owner: "AllanChain") {
      issues(first: 10, labels: ["blog: programing"]) {
        edges {
          node {
            title
            bodyHTML
            createdAt
            lastEditedAt
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
