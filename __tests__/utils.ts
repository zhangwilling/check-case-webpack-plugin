import { createFsFromVolume, Volume } from 'memfs';
import webpack, { Configuration } from 'webpack';
import { CheckCaseWebpackPlugin, ICaseCheckOptions } from '../src/main';
import path from 'path';

export function ensureWebpackMemoryFs() {
  const fs = createFsFromVolume(new Volume());
  const nextFs = Object.create(fs);
  nextFs.join = () => {
    //monkey patch it as join is not a standard API, don't use it.
  };

  return nextFs;
}

type Compile = (options: Configuration) => Promise<webpack.Stats.ToJsonOutput>;

export const compile: Compile = options => {
  return new Promise((resolve, reject) => {
    const compiler = webpack(options);
    compiler.outputFileSystem = ensureWebpackMemoryFs();
    compiler.run((err, stats) => {
      if (err) {
        reject(err);
      } else {
        resolve(
          stats.toJson({
            all: false,
            warnings: true,
            errors: true
          })
        );
      }
    });
  });
};

type GenWebpackOptions = (
  contextRelPath: string,
  entryRelPath: string,
  pluginOptions: ICaseCheckOptions
) => webpack.Configuration;

export const genWebpackOptions: GenWebpackOptions = (
  contextRelPath,
  entryRelPath,
  { caseType, checkInfoType, exclude }
) => ({
  context: path.join(__dirname, contextRelPath),
  entry: {
    index: entryRelPath
  },
  mode: 'development',
  output: {
    path: path.join(__dirname, 'js'),
    filename: 'app.js'
  },
  plugins: [
    new CheckCaseWebpackPlugin({
      caseType,
      checkInfoType,
      exclude
    })
  ]
});
