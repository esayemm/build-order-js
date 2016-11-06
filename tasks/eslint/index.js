import path from 'path'
import invariant from 'invariant'

// buildorderType 'react'
export default async function babel({
  env: {
    cwd,
    projectRootPath,
  },
  options: {
    buildorderType = 'default',
  } = {},
  taskApi,
}) {
  const allowedTypes = ['default', 'react']
  invariant(!!~allowedTypes.indexOf(buildorderType), `--eslint-type must be one of these values '${allowedTypes}'`)

  /*
   * npm packages
   */
  await taskApi.addPackages({
    packages: [
      // required if using certain babel enabled features
      // eslint-config-esayemm sets the parser config
      // https://github.com/babel/babel-eslint
      'babel-eslint',
      'eslint',
      'eslint-config-esayemm',
      buildorderType === 'react' && 'eslint-plugin-react',
    ].filter(a => a),
    dev: true,
  })

  /*
   * package.json
   */
  await taskApi.addToPackageJson({
    json: {
      scripts: {
        'eslint': './node_modules/eslint/bin/eslint.js .',
      },
    },
  })

  /*
   * eslint files
   */
  await taskApi.addFile({
    fileContent: [
      'build/',
      'lib/',
      'node_modules/',
    ].join('\n'),
    dest: '.eslintignore',
  })

  await taskApi.addToJsonFile({
    dest: '.eslintrc',
    json: {
      "extends": [
        buildorderType === 'react' ? "esayemm/lib/react" : "esayemm",
      ].filter(a => a),
    },
  })

}
