## About

We should standard file case type to avoid sensitive case problem.

Uppercase case is not recommended, we encourage to use snake or kebab case.

## Output

e.g. components/Pascal/file.tsx

After using kebab case type of this plugin will output

`[CheckCaseWebpackPlugin] src/components/Pascal/file.tsx does not respect kebab rule.`

## Install

npm i check-case-webpack-plugin

## Usage

```js
const { CheckCaseWebpackPlugin } = require('check-case-webpack-plugin');

const webpackConfig = {
  // context: 'your project path absolute path' // recommend define context.
  plugins: [
    new CheckCaseWebpackPlugin({})
    // other plugins ...
  ]
  // other webpack config ...
};
```

## Plugin API

```ts
type ValidCaseType = 'kebab' | 'snake';

type CheckInfoType = 'warn' | 'error' | 'none';

interface ICaseCheckOptions {
  caseType: ValidCaseType;
  checkInfoType?: CheckInfoType;
  exclude?: Array<RegExp>;
}
```

- caseType

  Choose case type you like.It's a required option.

  - 'kebab' e.g. `kebab-case`
  - 'snake' e.g. `snake_case`

- checkInfoType

  Choose info level you like. Default is `error`.

  - 'error' output webpack errors
  - 'warn' output webpack warnings
  - 'none' never output anything

- exclude
  There ara some files you don't want to check, such as files in node_modules. Default is `[/node_modules/]

## Notice

Recomend define context in webpack.config.js as check path will check webpack cwd path, if not some extra path will be checked.
