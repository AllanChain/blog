const { Plugin } = require('release-it')

module.exports = class ConventionalChangelog extends Plugin {
  async init () {
    const branch = await this.exec('git branch --show-current', { options: { write: false } })
    if (branch !== 'dev') throw new Error('New releases should on dev branch')

    await this.exec('git fetch')
    const refsToCheck = [
      ['gridsome', 'dev'],
      ['origin/dev', 'dev'],
      ['dev', 'origin/dev'], // dev should be pushed before release
      ['origin/gridsome', 'gridsome']
    ]

    for (const [oldRef, newRef] of refsToCheck) {
      try {
        // check if we can fast-forward oldRef to newRef
        await this.exec(`git merge-base --is-ancestor ${oldRef} ${newRef}`, { options: { write: false } })
      } catch (err) {
        throw new Error(`Branch ${oldRef} and ${newRef} out of sync. Please push & pull before release.`)
      }
    }

    this.registerPrompts({
      merge: {
        type: 'confirm',
        default: true,
        message: () => 'Merge to gridsome branch?'
      }
    })
  }

  async afterRelease () {
    await this.step({
      enabled: true,
      task: () => this.mergeToGridsome(),
      label: 'merge-to-default',
      prompt: 'merge'
    })
  }

  async mergeToGridsome () {
    await this.exec('git checkout gridsome')
    await this.exec('git merge dev')
    await this.exec('git push')
    await this.exec('git checkout dev')
  }
}
