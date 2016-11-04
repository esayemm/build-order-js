import CommanderShepard from 'commander-shepard'
import * as helper from './helper.js'
import npmClientAdapter from './npm-client-adapter.js'
import chalk from 'chalk'
import * as commands from './commands/index.js'

async function initialize() {
  await helper.areCommandsInstalled([['yarn', 'npm'], 'git'])
}

function setupCommanderShepard() {
  const pkg = require('../package.json')
  const binName = Object.keys(pkg.bin)[0]
  const c = new CommanderShepard({
    pkg,
    usage: `${binName} <command> [command arguments] [flags]`,
    description: `Set up your javascript project procedurally`,
    globalOptions: {
      'npmClient': {
        name: '--npm',
        help: 'specify npm client to use [npm || yarn] defaults to npm',
      },
    },
  })

  c.add({
    name: 'tasks',
    usage: `${binName} tasks [tasks]`,
    help: 'apply tasks to the current project',
    command: commands.tasks,
  })

  c.add({
    name: 'buildorders',
    usage: `${binName} buildorders [names]`,
    help: 'apply build orders to the current project',
    command: commands.buildorders,
  })

  npmClientAdapter.setAdapter(c.options.npm || 'npm')

  c.start()
}

async function main() {
  await initialize()
  setupCommanderShepard()
}

main()
.catch(e => {
  console.log(chalk.red(e.message))
})
