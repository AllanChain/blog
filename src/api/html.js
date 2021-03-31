function ChainHTML (html) {
  this.html = html

  this.use = plugin => {
    this.html = plugin(this.html)
    return this
  }
  this.end = () => this.html
}

module.exports = {
  // Core plugins are used both server side (post) and client side (comment)
  htmlPlugins: {
    codeLang: html => html.replace(
      /(<div class="highlight highlight-(source|text)-(.*?)">)<pre>(.*?)<\/pre>/gs,
      `$1<div class="code-bar">
      <span class="mdi mdi-content-copy"></span>
      <span class="code-lang">$3</span>
      </div><pre><code>$4</code></pre>`
    ),
    trimIssue: html => html.replace(
      /<a class="issue-link js-issue-link" .*? href/g,
      '<a class="issue-link" href'
    ),
    issueLink: html => html.replace(
      /<a href="\d+">(.*?)(#.*?)?<\/a>/g,
      `<a class="post-link" href="${process.env.GRIDSOME_BASE_URL}post/$1$2">$1$2</a>`
    )
  },
  ChainHTML
}
