export function ChainHTML(html) {
  this.html = html

  this.use = (plugin) => {
    this.html = plugin(this.html)
    return this
  }
  this.end = () => this.html
}

// Core plugins are used both server side (post) and client side (comment)
export const htmlPlugins = {
  codeLang: (html) =>
    html.replace(
      // `g`: match all occurence; `[^]` to match all characters
      /<div.+?(highlight-(?:source|text)-(.+?))\b[^]+?><pre>([^]+?)<\/pre>/g,
      `<div class="highlight $1">
      <div class="code-bar">
      <span class="mdi mdi-content-copy"></span>
      <span class="code-lang">$2</span>
      </div><pre><code>$3</code></pre>`
    ),
  trimIssue: (html) =>
    html.replace(
      /<a class="issue-link js-issue-link" .*? href/g,
      '<a class="issue-link" href'
    ),
  issueLink: (html) =>
    html.replace(
      /<a href="\d+">(.*?)(#.*?)?<\/a>/g,
      `<a class="post-link" href="${process.env.GRIDSOME_BASE_URL}post/$1$2">$1$2</a>`
    ),
}
