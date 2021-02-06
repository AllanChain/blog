const { execSync } = require('child_process')
const { version } = require('../package.json')

execSync('git add -A')
execSync(`git commit -v -m "chore(release): v${version}"`)
execSync(`git tag v${version} -sm "${version}"`)
execSync('git push --follow-tags')
