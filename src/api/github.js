const axios = require('axios')
const queries = require('./queries')
const config = require('./config')

module.exports = {
  async gql (query, variables) {
    variables = { ...config, ...variables }
    const resp = await axios({
      method: 'post',
      url: 'https://api.github.com/graphql',
      data: { query: queries[query], variables },
      headers: {
        Authorization: 'bearer bc48cb2be22ab0b18b1a5dd0daa3dcc6501b5632'
      }
    })
    console.log(resp.data)
    //          axios gql
    return resp.data.data
  },
  htmlConvert (html) {
    return html.replace(
      /(<div class="highlight highlight-source-(.*?)">)<pre>(.*?)<\/pre>/gs,
      '$1<div class="code-lang">$2</div><pre><code>$3</code></pre>')
  }
}
