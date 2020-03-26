import { CheckCaseWebpackPlugin } from '../src/main';
import { compile, genWebpackOptions } from './utils';

describe('webpack plugin', () => {
  it('static utils hasFirstUpperCaseFile: path file contains fisrt upperCase', () => {
    const hasFirstUpperCaseFile = CheckCaseWebpackPlugin.hasFirstUpperCaseFile;
    expect(hasFirstUpperCaseFile('/user/Willing/123')).toBe(true);
    expect(hasFirstUpperCaseFile('/user/willing/123')).toBe(false);
  });

  it('static utils hasUpperCaseFile: path contains upperCase', () => {
    const hasUpperCaseFile = CheckCaseWebpackPlugin.hasUpperCaseFile;
    expect(hasUpperCaseFile('/user/willingZ/123')).toBe(true);
    expect(hasUpperCaseFile('/user/willingz/123')).toBe(false);
    expect(hasUpperCaseFile('/user/willing__z/123')).toBe(false);
  });

  it('PascalCase project', async () => {
    const options = genWebpackOptions('./fixtures/PascalCase', './DemoApp.js', {
      caseType: 'kebab'
    });
    const stats = await compile(options);
    expect(stats.warnings).toEqual([]);
    expect(stats.errors[0]).toEqual(
      CheckCaseWebpackPlugin.infoTpl(
        'CheckCaseWebpackPlugin',
        'DemoApp.js',
        'kebab'
      )
    );
  });

  it('kebab-case project', async () => {
    const options = genWebpackOptions(
      './fixtures/kebab-case/',
      './demo-app.js',
      { caseType: 'kebab' }
    );

    const stats = await compile(options);
    expect(stats.warnings).toEqual([]);
    expect(stats.errors.length).toEqual(0);
  });

  it('snake_case project', async () => {
    const options = genWebpackOptions(
      './fixtures/snake_case/',
      './demo_app.js',
      { caseType: 'snake' }
    );

    const stats = await compile(options);
    expect(stats.warnings).toEqual([]);
    expect(stats.errors).toEqual([]);
  });

  it('snake_case should respect kebab-case', async () => {
    const options = genWebpackOptions(
      './fixtures/snake_case_kebab_dep',
      './demo_app.js',
      { caseType: 'kebab' }
    );

    const stats = await compile(options);
    expect(stats.warnings).toEqual([]);
    expect(stats.errors[0]).toEqual(
      CheckCaseWebpackPlugin.infoTpl(
        'CheckCaseWebpackPlugin',
        'demo_app.js',
        'kebab'
      )
    );
    expect(stats.errors[1]).toEqual(
      CheckCaseWebpackPlugin.infoTpl(
        'CheckCaseWebpackPlugin',
        'utils/dep_b.js',
        'kebab'
      )
    );
  });

  it('change checkInfoType warn', async () => {
    const options = genWebpackOptions(
      './fixtures/snake_case/',
      './demo_app.js',
      { caseType: 'kebab', checkInfoType: 'warn' }
    );

    const stats = await compile(options);
    expect(stats.errors).toEqual([]);
    expect(stats.warnings[0]).toEqual(
      CheckCaseWebpackPlugin.infoTpl(
        'CheckCaseWebpackPlugin',
        'demo_app.js',
        'kebab'
      )
    );
  });

  it('change checkInfoType none', async () => {
    const options = genWebpackOptions(
      './fixtures/snake_case/',
      './demo_app.js',
      {
        caseType: 'kebab',
        checkInfoType: 'none'
      }
    );

    const stats = await compile(options);
    expect(stats.warnings).toEqual([]);
    expect(stats.errors).toEqual([]);
  });

  it('exclude regex', async () => {
    const options = genWebpackOptions(
      './fixtures/snake_case_kebab_dep/',
      './demo_app.js',
      {
        caseType: 'snake',
        exclude: [/node_modules/, /dep-a/]
      }
    );

    const stats = await compile(options);
    expect(stats.warnings).toEqual([]);
    expect(stats.errors.length).toEqual(0);
  });

  it('exclude node_modules by default', async () => {
    const okOptions = genWebpackOptions(
      './fixtures/snake_case_node_modules/',
      './demo_app.js',
      {
        caseType: 'snake'
      }
    );
    const okStats = await compile(okOptions);
    expect(okStats.warnings).toEqual([]);
    expect(okStats.errors.length).toEqual(0);

    const errOptions = genWebpackOptions(
      './fixtures/snake_case_node_modules/',
      './demo_app.js',
      {
        caseType: 'snake',
        exclude: []
      }
    );
    const errStats = await compile(errOptions);
    expect(errStats.warnings).toEqual([]);
    expect(errStats.errors[0]).toContain('node_modules/antd/lib/Icon.js');
  });
});
