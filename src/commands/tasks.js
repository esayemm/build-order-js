import process from 'process'
import * as helper from '../helper.js'
import taskApi from '../task-api.js'
import config from '../config.js'
import chalk from 'chalk'

export default async function tasks({ options, args:taskNames }) {

  const cwd = process.cwd()
  const handlers = helper.extractHandlers({
    cwd,
    names: taskNames,
    defaultDir: config.defaultTaskDir,
  })

  const projectRootPath = await helper.getProjectRootPath()
  await helper.mapAsync(handlers, async (fn, i) => {
    helper.taskApiLogHeader('START TASKLIST', taskNames[i])
    console.log(``)

    await fn({
      options,
      env: {
        cwd,
        projectRootPath,
      },
      taskApi,
    })

    helper.taskApiLogHeader('END TASKLIST', taskNames[i])
    console.log(``)
  })

  console.log(chalk.green(`All done!`))

}
