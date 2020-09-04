/**
 * Auto get GraphQL query in different envs
 * @param {string} name name of the query
 *
 * Note to make this works, `browser` section
 * in `package.json` is needed.
 */
module.exports = name => {
  if (process.isClient) return require(`./${name}.gql`).default

  const { readFileSync } = require('fs')
  const { resolve } = require('path')
  return readFileSync(
    resolve(__dirname, `./${name}.gql`),
    { encoding: 'utf-8' }
  )
}
