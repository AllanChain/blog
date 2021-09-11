/* eslint-disable no-template-curly-in-string */
module.exports = {
  hooks: {},
  git: {
    commit: true,
    commitMessage: 'chore(release): v${version}',
    commitArgs: ['-S'],
    tag: true,
    tagArgs: ['-s'],
    tagAnnotation: 'v${version}',
    push: true,
    pushArgs: ['--follow-tags']
  },
  npm: {
    publish: false
  },
  github: {
    release: true
  },
  plugins: {
    '@release-it/conventional-changelog': {
      preset: {
        name: 'conventionalcommits',
        types: [
          { type: 'feat', section: ':sparkles: Features' },
          { type: 'fix', section: ':bug: Bug Fixes' },
          { type: 'chore', section: ':bricks: Chores' },
          { type: 'ci', section: ':gear: Continuous Integration'},
          { type: 'style', hidden: true },
          { type: 'refactor', section: ':newspaper_roll: Refactor' },
          { type: 'perf', section: ':rocket: Performance' },
          { type: 'test', section: ':white_check_mark: Tests' },
          { type: 'enhance', section: ':man_in_manual_wheelchair: Simply UX Enhance' }
        ]
      }
    },
    './scripts/release-it-merge-master.js': {}
  }
}
