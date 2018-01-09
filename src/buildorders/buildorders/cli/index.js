import * as tasks from '../../tasks'
import taskAPI    from 'taskAPI'

export default async function cli({ flags }) {
  await tasks.bootstrap({ name: flags.name })
  await tasks.mocha()
  await tasks.eslint({ extend: 'eslint-config-esayemm' })

  await taskAPI.addPackages({
    packages: ['app-module-path'],
  })

  await taskAPI.addPackages({
    packages: ['jbs-node', 'babel-register', 'babel-polyfill'],
    dev: true,
  })

  // package json
  await taskAPI.addToPackageJson({
    json: {
      scripts: {
        build:
          './node_modules/jbs-node/bin.js build --input src --output build',
        prepublish: 'npm run build',
        preversion: 'npm run lint && npm run test',
        version: 'npm publish',
        postversion: 'git add . && git push && git push --tags',
      },
      babel: {
        presets: ['./node_modules/jbs-node/configs/babel-preset-jbs-node.js'],
      },
      preferGlobal: true,
      bin: {
        [flags.name + '-dev']: './dev.entry.js',
        [flags.name]: './entry.js',
      },
      files: ['entry.js', 'dev.entry.js', 'build/'],
    },
  })

  // dev entry
  await taskAPI.addFile({
    dest: './dev.entry.js',
    fileContent: [
      `#!/usr/bin/env node`,
      `// use this for dev, production will use ./entry.js`,
      `const path = require('path')`,
      `require('app-module-path').addPath(path.resolve(__dirname, './src'))`,
      `require('babel-register')`,
      `require('babel-polyfill')`,
      `require('./src')`,
    ].join('\n'),
  })
  await taskAPI.shell({ command: `chmod 0755 ./dev.entry.js` })

  // build entry
  await taskAPI.addFile({
    dest: './entry.js',
    fileContent: [
      `#!/usr/bin/env node`,
      `const path = require('path')`,
      `require('app-module-path').addPath(path.resolve(__dirname, './build'))`,
      `require('./build')`,
    ].join('\n'),
  })
  await taskAPI.shell({ command: `chmod 0755 ./entry.js` })

  await taskAPI.shell({ command: `mkdir src` })
  await taskAPI.shell({ command: `touch src/index.js` })

  if (flags.git) {
    await taskAPI.gitInit()
  }
}