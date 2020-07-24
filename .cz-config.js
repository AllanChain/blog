const typesDoc = `
* feat:     A new feature
* fix:      A bug fix
* ui:       Prettier UI without adding new feature
* docs:     Documentation only changes
* style:    Changes that do not affect the meaning of the code
* refactor: Restructure code without altering functionality
* perf:     A code change that improves performance
* chore:    Changes to the build process or auxiliary tools
            and libraries such as documentation generation
* revert:   Revert to a commit
* WIP:      Work in progress
`

const typesDocSplit = typesDoc.split('\n').slice(1, -1)
const types = []

for (const line of typesDocSplit) {
  if (line.startsWith('* ')) {
    const name = line.substr(2)
    const value = name.split(':', 1)[0]
    types.push({ value, name })
  } else {
    types[types.length - 1].name += '\n' + line
  }
}

module.exports = {
  types,
  allowCustomScopes: true,
  scopes: ['post', 'list', 'label', 'comment', 'reaction', 'pwa']
    .map(scope => ({ name: scope }))
}
