#!/usr/bin/env node

export const PACKAGE_MANAGER = {
  npm: {
    init: 'npm install',
    install: 'npm install',
    run: 'npm run',
  },
  yarn: {
    init: 'yarn',
    install: 'yarn add',
    run: 'yarn',
  },
  pnpm: {
    init: 'pnpm install',
    install: 'pnpm add',
    run: 'pnpm',
  },
} as const;
export const PACKAGE_MANAGER_PROMPT = {
  name: 'packageManager',
  message: 'Choose package manager?',
  choices: Object.keys(PACKAGE_MANAGER).map((manager) => ({
    value: manager,
  })),
};
export const FETCH_FILE_ROOT = 'https://raw.githubusercontent.com/codevilot/create-convention/main/template/';

export const CONFIG_WITHOUT_INSTALL = {
  git: { fileName: '.gitignore', configName: 'git' },
  prettier: { fileName: '.prettierignore', configName: 'prettier' },
  vscode: { fileName: '.vscode/settings.json', configName: 'vscode' },
} as const;

export const CONFIG = {
  prettier: {
    fileName: '.prettierrc',
    configName: 'prettier',
    prompt: {
      type: 'confirm',
      name: 'prettier',
      message: 'create prettierrc',
    },
  },
  eslint: {
    fileName: '.eslintrc',
    configName: 'eslint',
    prompt: {
      type: 'confirm',
      name: 'eslint',
      message: 'create eslintrc',
    },
  },
} as const;
