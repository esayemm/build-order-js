import * as tasks from '../../tasks'
import path       from 'path'
import taskAPI    from 'taskAPI'

export default async function frontendApp({ flags }) {
  await tasks.bootstrap({ name: flags.name })
  await tasks.prettier()
  await tasks.eslint({
    packages: 'eslint-config-esayemm',
    extend: 'eslint-config-esayemm',
  })
  await tasks.ci()
  await taskAPI.addPackages({ devPackages: ['jbs-fe'] })
  await taskAPI.addToPackageJson({
    json: {
      main: `./build/index.js`,
      scripts: {
        build: 'NODE_PATH=./src ./node_modules/jbs-fe/bin.js build',
        start: 'NODE_PATH=./src ./node_modules/jbs-fe/bin.js dev',
        test: `NODE_PATH=./src ./node_modules/jbs-fe/bin.js test --single-run`,
        'test:watch': `NODE_PATH=./src ./node_modules/jbs-fe/bin.js test`,
        deploy: 'npm run build && echo add deployment script here',
      },
      babel: {
        presets: ['./node_modules/jbs-fe/configs/babel-preset-jbs-fe.js'],
      },
    },
  })
  await taskAPI.copy({
    src: path.resolve(__dirname, '../../templates/frontend-app/src'),
    dest: './src',
  })
  if (flags.git) {
    await taskAPI.gitInit()
  }
}
