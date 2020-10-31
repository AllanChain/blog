const axios = require('axios')
const config = require('../config')
const { readFileSync } = require('fs')
const { resolve } = require('path')

module.exports = async function serverData (variables) {
  const query = readFileSync(
    resolve(__dirname, './data.gql'),
    { encoding: 'utf-8' }
  )
  variables = { ...config.gqlVar, ...variables }

  const resp = await axios({
    method: 'post',
    url: 'https://api.github.com/graphql',
    data: { query, variables },
    headers: {
      Authorization: `bearer ${process.env.GITHUB_TOKEN}`
    }
  })
  if (resp.data.error) {
    console.log(resp.data.errors)
    throw resp.data.errors[0].message
  }
  //          axios gql
  return resp.data.data
}
