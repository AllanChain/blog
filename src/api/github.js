const axios = require('axios')
const queries = require('./queries')

module.exports = {
  async gql (query, variables) {
    const resp = await axios({
      method: 'post',
      url: 'https://api.github.com/graphql',
      data: { query: queries[query], variables },
      headers: {
        Authorization: 'bearer bc48cb2be22ab0b18b1a5dd0daa3dcc6501b5632'
      }
    })
    //          axios gql
    return resp.data.data.repository
  },
  htmlConvert (html) {
    return html.replace(
      /(<div class="highlight highlight-source-(.*?)">)<pre>(.*?)<\/pre>/gs,
      '$1<div class="code-lang">$2</div><pre><code>$3</code></pre>')
  }
}
