/**
 * This module is used by both server and client
 * Need to be node and webpack capable
 */

const axios = require('axios')
const queries = require('./queries')
const config = require('../config')

function ChainHTML (html) {
  this.html = html
  this.use = plugin => {
    this.html = plugin(this.html)
    return this
  }
  this.end = () => this.html
}

module.exports = {
  config,
  async gql (query, variables) {
    variables = { ...config.gqlVar, ...variables }
    const resp = await axios({
      method: 'post',
      url: 'https://api.github.com/graphql',
      data: { query: queries[query], variables },
      headers: {
        Authorization: 'bearer bc48cb2be22ab0b18b1a5dd0daa3dcc6501b5632'
      }
    })
    if (resp.data.error) {
      console.log(resp.data.errors)
      throw resp.data.errors[0].message
    }
    //          axios gql
    return resp.data.data
  },
  htmlPlugins: {
    codeLang: html => html.replace(
      /(<div class="highlight highlight-source-(.*?)">)<pre>(.*?)<\/pre>/gs,
      '$1<div class="code-lang">$2</div><pre><code>$3</code></pre>'
    )
  },
  ChainHTML
}
