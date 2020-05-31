const processor = require('remark')()
  .use(require('remark-emoji'))
  .use(require('remark-html'))
  .process

module.exports = text => {
  let result
  processor(text, (err, file) => {
    result = String(file)
    console.log(err)
  })
  return result
}
