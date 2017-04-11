import path       from 'path'
import * as tasks from '../../tasks'

/*
 * refer to commands/index.js for the opts passed into this function
 *
 * args used
 * --git
 */
export default async function isomorphic(opts) {
  const taskApi = opts.taskApi
  opts.flags.buildorderType = 'isomorphic'

  await tasks.bootstrap(opts)
  await tasks.babel(opts)
  await tasks.eslint(opts)
  await tasks.test(opts)
  await tasks.ci(opts)
  await tasks.webpack(opts)

  await taskApi.addToPackageJson({
    json: {
      main: `${opts.flags.babelOutdir}/index.js`,
      scripts: {
        preversion: 'npm run eslint && npm run test',
        version: 'npm run webpack && git add .',
        postversion: 'git push && git push --tags && npm publish',
      },
    },
  })

  await taskApi.copyDirectory({
    src: path.resolve(__dirname, './templates/src'),
    dest: './src',
  })

  if (opts.flags.git) {
    await taskApi.gitInit()
  }

}