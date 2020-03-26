import { Compiler, compilation } from 'webpack';
import path from 'path';

export type ValidCaseType = 'kebab' | 'snake';

export type CheckInfoType = 'warn' | 'error' | 'none';

export interface ICaseCheckOptions {
  caseType: ValidCaseType;
  checkInfoType?: CheckInfoType;
  exclude?: Array<RegExp>;
}

export class CheckCaseWebpackPlugin {
  private PLUGIN_NAME = 'CheckCaseWebpackPlugin';
  private caseType: ValidCaseType;
  private checkInfoType: CheckInfoType = 'error';
  private compiler?: Compiler;
  private contextPath = '';
  private exclude: Array<RegExp> = [/node_modules/];
  constructor(
    options: ICaseCheckOptions = { caseType: 'kebab', checkInfoType: 'error' }
  ) {
    if (options.caseType === 'kebab' || options.caseType === 'snake') {
      this.caseType = options.caseType;
    } else {
      throw new Error(
        'Invalid caseType, only support snake and kebab. Check your options.'
      );
    }
    if (options.checkInfoType) {
      this.checkInfoType = options.checkInfoType;
    }

    if (options.exclude) {
      this.exclude = options.exclude;
    }
  }

  apply(compiler: Compiler) {
    this.compiler = compiler;
    this.compiler.hooks.entryOption.tap(this.PLUGIN_NAME, (context: string) => {
      this.contextPath = context;
    });

    if (this.checkInfoType === 'none') return;

    compiler.hooks.compilation.tap(this.PLUGIN_NAME, compilation => {
      compilation.hooks.optimizeModules.tap(this.PLUGIN_NAME, _modules => {
        // maybe it's caused by @types/webpack, i use `as` to redefine modules.
        const modules = (_modules as unknown) as Array<{ resource: string }>;
        for (const module of modules) {
          if (
            !module.resource ||
            this.exclude.some(exludeRegx => module.resource.match(exludeRegx))
          ) {
            continue;
          }
          const info = this.checkModuleCaseType(module.resource, this.caseType);
          if (info) {
            if (this.checkInfoType === 'warn') compilation.warnings.push(info);
            if (this.checkInfoType === 'error') compilation.errors.push(info);
            if (this.checkInfoType === 'none') return;
          }
        }
      });

      return null as any;
    });
  }

  checkModuleCaseType(
    modulePath: string,
    caseType: ValidCaseType
  ): string | void {
    const relativePath = path.relative(this.contextPath, modulePath);
    if (caseType === 'kebab') {
      if (
        relativePath.includes('_') ||
        CheckCaseWebpackPlugin.hasUpperCaseFile(relativePath)
      ) {
        return CheckCaseWebpackPlugin.infoTpl(
          this.PLUGIN_NAME,
          relativePath,
          this.caseType
        );
      }
    }

    if (caseType === 'snake') {
      if (
        relativePath.includes('-') ||
        CheckCaseWebpackPlugin.hasUpperCaseFile(relativePath)
      ) {
        return CheckCaseWebpackPlugin.infoTpl(
          this.PLUGIN_NAME,
          relativePath,
          this.caseType
        );
      }
    }
  }

  static hasFirstUpperCaseFile(path) {
    return path.split('/').some(file => /[A-Z]/.test(file[0]));
  }

  static hasUpperCaseFile(path) {
    return path.split('/').some(file => /[A-Z]/.test(file));
  }

  static infoTpl(pluginName, filePath, caseType) {
    return `[${pluginName}] ${filePath} does not respect ${caseType} rule.`;
  }
}
